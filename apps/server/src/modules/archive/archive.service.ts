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
import { QuizAttemptDocument } from '../quiz-attempts/schema/quiz-attempt.schema';
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
    @InjectModel('QuizAttempt')
    private readonly quizAttemptModel: SoftDeleteModel<QuizAttemptDocument>,
  ) {}

  async handleArchiveResource(resourceType: string, resourceId: string) {
    switch (resourceType) {
      case 'collection':
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
                stackCollection.push(child._id.toString());
              } else if (child.type === 'Note') {
                notesToArchive.push(child._id.toString());
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
      case 'note':
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
              'parentId._id': currentNoteId,
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
      case 'deck':
        const flashcards = await this.flashcardModel.find({
          deckId: resourceId,
        });
        await Promise.all(
          flashcards.map((flashcard: any) =>
            this.flashcardReviewModel.updateOne(
              { flashcardId: flashcard._id },
              { isArchived: true, archivedAt: new Date() },
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
      case 'quiz':
        await this.quizQuestionModel.updateMany(
          { quizTestId: resourceId },
          { isArchived: true, archivedAt: new Date() },
        );
        await this.quizAttemptModel.updateMany(
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
      case 'collection':
        const collectionsToRestore = [];
        const notesToRestore = [];
        const stackCollection = [resourceId];

        while (stackCollection.length > 0) {
          const currentCollectionId = stackCollection.pop();
          const currentCollection = await this.collectionModel.findOne({
            _id: currentCollectionId,
            isArchived: true,
          });

          if (currentCollection) {
            collectionsToRestore.push(currentCollection._id);
            for (const child of currentCollection.children ?? []) {
              if (child.type === 'Collection') {
                stackCollection.push(child._id.toString());
              } else if (child.type === 'Note') {
                notesToRestore.push(child._id.toString());
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
      case 'note':
        const restoredNotes = [];
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
              'parentId._id': currentNoteId,
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
        });
        await Promise.all(
          flashcards.map((flashcard: any) =>
            this.flashcardReviewModel.updateOne(
              { flashcardId: flashcard._id },
              { isArchived: false, archivedAt: null },
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
      case 'quiz':
        await this.quizQuestionModel.updateMany(
          { quizTestId: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
        );
        await this.quizAttemptModel.updateMany(
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

  async findAll(
    user: IUser,
    resourceType: string,
    currentPage: number,
    pageSize: number,
    qs: string,
  ) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    filter.isArchived = true;
    filter.userId = user._id;

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    let model: any;
    switch (resourceType) {
      case 'collection':
        model = this.collectionModel;
        break;
      case 'note':
        model = this.noteModel;
        break;
      case 'deck':
        model = this.deckModel;
        break;
      case 'quiz':
        model = this.quizTestModel;
        break;
      default:
        throw new BadRequestException('Invalid resource type');
    }

    const totalItems = (await model.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = await model
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .select('-userId')
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(resourceType: string, resourceId: string) {
    if (!mongoose.isValidObjectId(resourceId)) {
      throw new BadRequestException('Invalid Resource ID');
    }
    let model: any;
    switch (resourceType) {
      case 'collection':
        model = this.collectionModel;
        break;
      case 'note':
        model = this.noteModel;
        break;
      case 'deck':
        model = this.deckModel;
        break;
      case 'quiz':
        model = this.quizTestModel;
        break;
      default:
        throw new BadRequestException('Invalid resource type');
    }
    const resource = await model.findOne({ _id: resourceId, isArchived: true });
    if (!resource) {
      throw new NotFoundException(`Not found ${resourceType}`);
    }
    return resource;
  }
}
