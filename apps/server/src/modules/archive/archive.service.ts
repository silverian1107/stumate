import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
// import { CollectionDocument } from '../collections/schema/collection.schema';
// import { NoteDocument } from '../notes/schema/note.schema';
import { DeckDocument } from '../decks/schema/deck.schema';
import { FlashcardDocument } from '../flashcards/schema/flashcard.schema';
import { QuizTestDocument } from '../quiz-tests/schema/quiz-test.schema';
import { QuizQuestionDocument } from '../quiz-questions/schema/quiz-question.schema';
import { QuizAttemptDocument } from '../quiz-attempts/schema/quiz-attempt.schema';

@Injectable()
export class ArchiveService {
  constructor(
    // @InjectModel('Collection')
    // private readonly collectionModel: SoftDeleteModel<CollectionDocument>,
    // @InjectModel('Note')
    // private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel('Deck')
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel('Flashcard')
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @InjectModel('QuizTest')
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @InjectModel('QuizQuestion')
    private readonly quizQuestionModel: SoftDeleteModel<QuizQuestionDocument>,
    @InjectModel('QuizAttempt')
    private readonly quizAttemptModel: SoftDeleteModel<QuizAttemptDocument>,
  ) {}

  async handleArchiveResource(resourceType: string, resourceId: string) {
    switch (resourceType) {
      // case 'collection':
      //   const notes = this.noteModel.updateMany(
      //     {  },
      //     { isArchived: true, archivedAt: new Date() },
      //   );
      //   return await this.collectionModel.findOneAndUpdate(
      //     { _id: resourceId },
      //     { isArchived: true, archivedAt: new Date() },
      //     { new: true },
      //   );
      // case 'note':
      //   return await this.noteModel.findOneAndUpdate(
      //     { _id: resourceId },
      //     { isArchived: true, archivedAt: new Date() },
      //     { new: true },
      //   );
      case 'deck':
        await this.flashcardModel.updateMany(
          { deckId: resourceId },
          { isArchived: true, archivedAt: new Date() },
        );
        return await this.deckModel.findOneAndUpdate(
          { _id: resourceId },
          { isArchived: true, archivedAt: new Date() },
          { new: true },
        );
      case 'quiz':
        await this.quizQuestionModel.updateMany(
          { quizTestId: resourceId },
          { isArchived: true, archivedAt: new Date() },
        );
        await this.quizAttemptModel.updateMany(
          { quizTestId: resourceId },
          { isArchived: true, archivedAt: new Date() },
        );
        return await this.quizTestModel.findOneAndUpdate(
          { _id: resourceId },
          { isArchived: true, archivedAt: new Date() },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async handleRestoreResource(resourceType: string, resourceId: string) {
    switch (resourceType) {
      case 'deck':
        await this.flashcardModel.updateMany(
          { deckId: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
        );
        return await this.deckModel.findOneAndUpdate(
          { _id: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
          { new: true },
        );
      case 'quiz':
        await this.quizQuestionModel.updateMany(
          { quizTestId: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
        );
        await this.quizAttemptModel.updateMany(
          { quizTestId: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
        );
        return await this.quizTestModel.findOneAndUpdate(
          { _id: resourceId, isArchived: true },
          { isArchived: false, archivedAt: null },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  findAll() {
    return `This action returns all archive`;
  }

  findOne(id: number) {
    return `This action returns a #${id} archive`;
  }

  remove(id: number) {
    return `This action removes a #${id} archive`;
  }
}
