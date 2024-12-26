import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { DeckDocument } from '../decks/schema/deck.schema';
import { FlashcardDocument } from '../flashcards/schema/flashcard.schema';
import { QuizTestDocument } from '../quiz-tests/schema/quiz-test.schema';
import { QuizQuestionDocument } from '../quiz-questions/schema/quiz-question.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { IUser } from '../users/users.interface';
import { CollectionDocument } from '../collections/schema/collection.schema';
import { NoteDocument } from '../notes/schema/note.schema';
import { SummaryDocument } from '../summaries/schema/summary.schema';
import { FlashcardReviewDocument } from '../flashcards/schema/flashcard-review.schema';

@Injectable()
export class ArchiveService {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: SoftDeleteModel<CollectionDocument>,
    @InjectModel('Note')
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel('Summary')
    private readonly summaryModel: SoftDeleteModel<SummaryDocument>,
    @InjectModel('Deck')
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel('Flashcard')
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @InjectModel('FlashcardReview')
    private readonly flashcardReviewModel: SoftDeleteModel<FlashcardReviewDocument>,
    @InjectModel('QuizTest')
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @InjectModel('QuizQuestion')
    private readonly quizQuestionModel: SoftDeleteModel<QuizQuestionDocument>,
  ) {}

  async handleArchiveResource(resourceType: string, resourceId: string) {
    switch (resourceType) {
      case 'collections':
        const collectionsToArchive = [];
        const notesToArchive = [];
        const stackCollection = [resourceId];

        while (stackCollection.length > 0) {
          const currentCollectionId = stackCollection.pop();
          const currentCollection = await this.collectionModel.findOne({
            _id: currentCollectionId,
          });

          if (currentCollection) {
            collectionsToArchive.push(currentCollection._id);
            for (const child of currentCollection.children ?? []) {
              if (child.type === 'Collection') {
                stackCollection.push(child._id);
              } else if (child.type === 'Note') {
                notesToArchive.push(child._id);
                const stackChildNotes = [child._id];
                while (stackChildNotes.length > 0) {
                  const currentNoteId = stackChildNotes.pop();
                  const currentNote = await this.noteModel.findOne({
                    _id: currentNoteId,
                  });

                  if (currentNote) {
                    notesToArchive.push(currentNote._id);
                    const childNotes = await this.noteModel.find({
                      parentId: currentNoteId,
                    });
                    stackChildNotes.push(
                      ...childNotes.map((child) => child._id.toString()),
                    );
                  }
                }
              }
            }
          }
        }

        await Promise.all([
          this.summaryModel.updateMany(
            { noteId: { $in: notesToArchive } },
            { isArchived: true, archivedAt: new Date() },
          ),
          this.noteModel.updateMany(
            { _id: { $in: notesToArchive } },
            { isArchived: true, archivedAt: new Date() },
          ),
          this.collectionModel.updateMany(
            { _id: { $in: collectionsToArchive } },
            { isArchived: true, archivedAt: new Date() },
          ),
        ]);
        return 'Collection was archived successfully';
      case 'notes':
        const archivedNotes = [];
        const stackNote = [resourceId];

        while (stackNote.length > 0) {
          const currentNoteId = stackNote.pop();
          const currentNote = await this.noteModel.findOne({
            _id: currentNoteId,
          });

          if (currentNote) {
            archivedNotes.push(currentNote._id);
            const childNotes = await this.noteModel.find({
              parentId: currentNoteId,
            });
            stackNote.push(...childNotes.map((child) => child._id.toString()));
          }
        }

        await Promise.all([
          this.summaryModel.updateMany(
            { noteId: { $in: archivedNotes } },
            { isArchived: true, archivedAt: new Date() },
          ),
          this.noteModel.updateMany(
            { _id: { $in: archivedNotes } },
            { isArchived: true, archivedAt: new Date() },
          ),
        ]);
        return 'Note was archived successfully';
      case 'decks':
        const flashcards = await this.flashcardModel.find({
          deckId: resourceId,
        });
        await Promise.all(
          flashcards.map((flashcard: any) =>
            this.flashcardReviewModel.updateOne(
              { flashcardId: flashcard._id },
              { nextReview: null },
            ),
          ),
        );
        await this.flashcardModel.updateMany(
          { deckId: resourceId },
          { isArchived: true, archivedAt: new Date() },
        );
        await this.deckModel.updateOne(
          { _id: resourceId },
          { isArchived: true, archivedAt: new Date() },
        );
        return 'Deck was archived successfully';
      case 'quizzes':
        await this.quizQuestionModel.updateMany(
          { quizTestId: resourceId },
          { isArchived: true, archivedAt: new Date() },
        );
        await this.quizTestModel.updateOne(
          { _id: resourceId },
          { isArchived: true, archivedAt: new Date() },
        );
        return 'Quiz was archived successfully';
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async handleRestoreResource(resourceType: string, resourceId: string) {
    switch (resourceType) {
      case 'collections':
        const collectionsToRestore = [];
        const notesToRestore = [];

        let currentCollectionId = resourceId;
        while (currentCollectionId) {
          const currentCollection = await this.collectionModel.findOne({
            _id: currentCollectionId,
            isArchived: true,
          });

          if (currentCollection) {
            collectionsToRestore.push(currentCollection._id);
            currentCollectionId = currentCollection.parentId ?? null;
          } else {
            break;
          }
        }

        const stackCollection = [resourceId];
        while (stackCollection.length > 0) {
          const currentCollectionId = stackCollection.pop();
          const currentCollection = await this.collectionModel.findOne({
            _id: currentCollectionId,
            isArchived: true,
          });

          if (currentCollection) {
            for (const child of currentCollection.children ?? []) {
              if (child.type === 'Collection') {
                stackCollection.push(child._id);
              } else if (child.type === 'Note') {
                notesToRestore.push(child._id);
                const stackChildNotes = [child._id];
                while (stackChildNotes.length > 0) {
                  const currentNoteId = stackChildNotes.pop();
                  const currentNote = await this.noteModel.findOne({
                    _id: currentNoteId,
                    isArchived: true,
                  });

                  if (currentNote) {
                    notesToRestore.push(currentNote._id);
                    const childNotes = await this.noteModel.find({
                      parentId: currentNoteId,
                      isArchived: true,
                    });
                    stackChildNotes.push(
                      ...childNotes.map((child) => child._id.toString()),
                    );
                  }
                }
              }
            }
          }
        }

        await Promise.all([
          this.summaryModel.updateMany(
            { noteId: { $in: notesToRestore }, isArchived: true },
            { isArchived: false, archivedAt: null },
          ),
          this.noteModel.updateMany(
            { _id: { $in: notesToRestore }, isArchived: true },
            { isArchived: false, archivedAt: null },
          ),
          this.collectionModel.updateMany(
            { _id: { $in: collectionsToRestore }, isArchived: true },
            { isArchived: false, archivedAt: null },
          ),
        ]);
        return 'Collection was restored successfully';
      case 'notes':
        const restoredNotes = [];

        let currentNoteId = resourceId;
        while (currentNoteId) {
          const currentNote = await this.noteModel.findOne({
            _id: currentNoteId,
            isArchived: true,
          });

          if (currentNote) {
            restoredNotes.push(currentNote._id);
            currentNoteId = currentNote.parentId ?? null;
          } else {
            break;
          }
        }

        const stackNote = [resourceId];
        while (stackNote.length > 0) {
          const currentNoteId = stackNote.pop();
          const currentNote = await this.noteModel.findOne({
            _id: currentNoteId,
            isArchived: true,
          });

          if (currentNote) {
            restoredNotes.push(currentNote._id);
            const childNotes = await this.noteModel.find({
              parentId: currentNoteId,
              isArchived: true,
            });
            stackNote.push(...childNotes.map((child) => child._id.toString()));
          }
        }

        await Promise.all([
          this.summaryModel.updateMany(
            { noteId: { $in: restoredNotes }, isArchived: true },
            { isArchived: false, archivedAt: null },
          ),
          this.noteModel.updateMany(
            { _id: { $in: restoredNotes }, isArchived: true },
            { isArchived: false, archivedAt: null },
          ),
        ]);
        return 'Note was restored successfully';
      case 'deck':
        const flashcards = await this.flashcardModel.find({
          deckId: resourceId,
          isArchived: true,
        });
        await Promise.all(
          flashcards.map((flashcard: any) =>
            this.flashcardReviewModel.updateOne(
              { flashcardId: flashcard._id },
              { nextReview: Date.now() },
            ),
          ),
        );
        await this.flashcardModel.updateMany(
          { deckId: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
        );
        await this.deckModel.updateOne(
          { _id: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
        );
        return 'Deck was restored successfully';
      case 'quizzes':
        await this.quizQuestionModel.updateMany(
          { quizTestId: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
        );
        await this.quizTestModel.updateOne(
          { _id: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
        );
        return 'Quiz was restored successfully';
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async findAll(user: IUser, resourceType: string, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    filter.isArchived = true;
    if (user.role === 'USER') {
      filter.$or = [{ userId: user._id }, { ownerId: user._id }];
    }

    let model: any;
    switch (resourceType) {
      case 'collections':
        model = this.collectionModel;
        break;
      case 'notes':
        model = this.noteModel;
        break;
      case 'deck':
        model = this.deckModel;
        break;
      case 'quizzes':
        model = this.quizTestModel;
        break;
      default:
        throw new BadRequestException('Invalid resource type');
    }

    const totalItems = (await model.find(filter)).length;

    const result = await model
      .find(filter)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      total: totalItems,
      result,
    };
  }

  async findOne(
    resourceType: string,
    resourceId: string,
    isArchived: boolean = false,
  ) {
    if (!mongoose.isValidObjectId(resourceId)) {
      throw new BadRequestException('Invalid Resource ID');
    }
    let model: any;
    switch (resourceType) {
      case 'collections':
        model = this.collectionModel;
        break;
      case 'notes':
        model = this.noteModel;
        break;
      case 'decks':
        model = this.deckModel;
        break;
      case 'quiz-tests':
        model = this.quizTestModel;
        break;
      default:
        throw new BadRequestException('Invalid resource type');
    }
    const resource = await model.findOne({ _id: resourceId, isArchived });
    if (!resource) {
      throw new NotFoundException(`Not found ${resourceType}`);
    }
    return resource;
  }
}
