import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Note, NoteDocument } from '../notes/schema/note.schema';
import { Deck, DeckDocument } from '../decks/schema/deck.schema';
import {
  QuizTest,
  QuizTestDocument,
} from '../quiz-tests/schema/quiz-test.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { NotificationsService } from '../notifications/notifications.service';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Summary, SummaryDocument } from '../summaries/schema/summary.schema';
import {
  QuizQuestion,
  QuizQuestionDocument,
} from '../quiz-questions/schema/quiz-question.schema';
import {
  Flashcard,
  FlashcardDocument,
} from '../flashcards/schema/flashcard.schema';

@Injectable()
export class SharedResourcesService {
  constructor(
    @InjectModel(Note.name)
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel(Summary.name)
    private readonly summaryModel: SoftDeleteModel<SummaryDocument>,
    @InjectModel(Deck.name)
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @InjectModel(QuizTest.name)
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @InjectModel(QuizQuestion.name)
    private readonly quizQuestionModel: SoftDeleteModel<QuizQuestionDocument>,
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async handleShareResourceWithUser(
    resourceType: string,
    resourceId: string,
    user: IUser,
    usernameOrEmail: string,
  ) {
    const sharedUser = await this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!sharedUser) {
      throw new NotFoundException('Not found user');
    }
    switch (resourceType) {
      case 'note':
        await this.summaryModel.updateOne(
          { noteId: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
        );
        await this.noteModel.updateOne(
          { _id: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          sharedUser,
          `New Note Shared`,
          `${user.username} has shared a note with you. Check it out now!`,
        );
        return 'Note was shared successfully';
      case 'deck':
        await this.flashcardModel.updateMany(
          { deckId: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
        );
        await this.deckModel.updateOne(
          { _id: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          sharedUser,
          `New Deck Shared`,
          `${user.username} has shared a deck with you. Check it out now!`,
        );
        return 'Deck was shared successfully';
      case 'quiz':
        await this.quizQuestionModel.updateMany(
          { quizTestId: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
        );
        await this.quizTestModel.updateOne(
          { _id: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          sharedUser,
          `New Quiz Shared`,
          `${user.username} has shared a quiz with you. Check it out now!`,
        );
        return 'Quiz was shared successfully';
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async handleRemoveSharedResourceWithUser(
    resourceType: string,
    resourceId: string,
    user: IUser,
    usernameOrEmail: string,
  ) {
    const unsharedUser = await this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!unsharedUser) {
      throw new NotFoundException('Not found user');
    }
    switch (resourceType) {
      case 'note':
        await this.summaryModel.updateOne(
          { noteId: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
        );
        await this.noteModel.updateOne(
          { _id: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          unsharedUser,
          `Note Unshared`,
          `${user.username} has unshared a note with you.`,
        );
        return 'Note was unshared successfully';
      case 'deck':
        await this.flashcardModel.updateMany(
          { deckId: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
        );
        await this.deckModel.updateOne(
          { _id: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          unsharedUser,
          `Deck Unshared`,
          `${user.username} has unshared a deck with you.`,
        );
        return 'Deck was unshared successfully';
      case 'quiz':
        await this.quizQuestionModel.updateMany(
          { quizTestId: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
        );
        await this.quizTestModel.updateOne(
          { _id: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          unsharedUser,
          `Quiz Unshared`,
          `${user.username} has unshared a quiz with you.`,
        );
        return 'Quiz was unshared successfully';
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

    filter.sharedWithUsers = { $in: [user._id] };

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    let model: any;
    let relatedModel: any;
    let relatedField: string;

    switch (resourceType) {
      case 'note':
        model = this.noteModel;
        relatedModel = this.summaryModel;
        relatedField = 'noteId';
        break;
      case 'deck':
        model = this.deckModel;
        relatedModel = this.flashcardModel;
        relatedField = 'deckId';
        break;
      case 'quiz':
        model = this.quizTestModel;
        relatedModel = this.quizQuestionModel;
        relatedField = 'quizTestId';
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

    const parentIds = result.map((item) => item._id);
    const relatedData = await relatedModel.find({
      [relatedField]: { $in: parentIds },
    });
    result.forEach((item) => {
      item.related = relatedData.filter(
        (related) => related[relatedField].toString() === item._id.toString(),
      );
    });

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

  async findOne(resourceType: string, resourceId: string, user: IUser) {
    if (!mongoose.isValidObjectId(resourceId)) {
      throw new BadRequestException('Invalid Resource ID');
    }
    let model: any;
    let relatedModel: any;
    let relatedField: string;

    switch (resourceType) {
      case 'note':
        model = this.noteModel;
        relatedModel = this.summaryModel;
        relatedField = 'noteId';
        break;
      case 'deck':
        model = this.deckModel;
        relatedModel = this.flashcardModel;
        relatedField = 'deckId';
        break;
      case 'quiz':
        model = this.quizTestModel;
        relatedModel = this.quizQuestionModel;
        relatedField = 'quizTestId';
        break;
      default:
        throw new BadRequestException('Invalid resource type');
    }

    const resource = await model.findOne({
      _id: resourceId,
      sharedWithUsers: { $in: [user._id] },
    });
    if (!resource) {
      throw new NotFoundException(`Not found ${resourceType}`);
    }
    const relatedData = await relatedModel.find({ [relatedField]: resourceId });
    const resourceWithDetails = {
      ...resource.toObject(),
      related: relatedData,
    };
    return resourceWithDetails;
  }
}
