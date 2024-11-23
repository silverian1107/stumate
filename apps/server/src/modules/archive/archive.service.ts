import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
// import { CollectionDocument } from '../collections/schema/collection.schema';
// import { NoteDocument } from '../notes/schema/note.schema';
import { DeckDocument } from '../decks/schema/deck.schema';
import { FlashcardDocument } from '../flashcards/schema/flashcard.schema';
import { QuizTestDocument } from '../quiz-tests/schema/quiz-test.schema';
import { QuizQuestionDocument } from '../quiz-questions/schema/quiz-question.schema';
import { QuizAttemptDocument } from '../quiz-attempts/schema/quiz-attempt.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

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

  async findAll(
    resourceType: string,
    currentPage: number,
    pageSize: number,
    qs: string,
  ) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    filter.isArchived = true;

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    let model: any;
    switch (resourceType) {
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
