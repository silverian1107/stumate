import {
  BadRequestException,
  ForbiddenException,
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
import {
  FlashcardReview,
  FlashcardReviewDocument,
} from '../flashcards/schema/flashcard-review.schema';
import { handleDuplicateName } from 'src/helpers/utils';

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
    @InjectModel(FlashcardReview.name)
    private readonly flashcardReviewModel: SoftDeleteModel<FlashcardReviewDocument>,
    @InjectModel(QuizTest.name)
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @InjectModel(QuizQuestion.name)
    private readonly quizQuestionModel: SoftDeleteModel<QuizQuestionDocument>,
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async checkOwnership(
    resourceType: string,
    resourceId: string,
    userId: string,
  ) {
    let resource: any;
    switch (resourceType) {
      case 'note':
        resource = await this.noteModel.findOne({ _id: resourceId });
        break;
      case 'deck':
        resource = await this.deckModel.findOne({ _id: resourceId });
        break;
      case 'quiz':
        resource = await this.quizTestModel.findOne({ _id: resourceId });
        break;
      default:
        throw new BadRequestException('Invalid resource type');
    }
    if (!resource) {
      throw new NotFoundException(`Not found ${resourceType}`);
    }
    const ownerId = resource.ownerId || resource.userId;
    return ownerId.toString() === userId;
  }

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

    const isOwner = await this.checkOwnership(
      resourceType,
      resourceId,
      user._id,
    );
    if (!isOwner) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
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

    const isOwner = await this.checkOwnership(
      resourceType,
      resourceId,
      user._id,
    );
    if (!isOwner) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
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

  async handleCloneResource(
    resourceType: string,
    resourceId: string,
    user: IUser,
  ) {
    let originalResource: any, newResource: any, originalResourceObject: any;
    switch (resourceType) {
      case 'note':
        originalResource = await this.noteModel.findOne({
          _id: resourceId,
          sharedWithUsers: { $in: [user._id] },
        });
        if (!originalResource) {
          throw new NotFoundException('Not found note');
        }
        originalResourceObject = originalResource.toObject();
        delete originalResourceObject._id;
        newResource = await this.noteModel.create({
          ...originalResourceObject,
          ownerId: user._id,
          isCloned: true,
          sharedWithUsers: [],
          createdBy: {
            _id: user._id,
            username: user.username,
          },
        });

        const originalSummary = await this.summaryModel.findOne({
          noteId: resourceId,
          sharedWithUsers: { $in: [user._id] },
        });
        const summaryObject = originalResource.toObject();
        delete summaryObject._id;
        if (originalSummary) {
          await this.summaryModel.create({
            ...summaryObject,
            userId: user._id,
            noteId: newResource._id,
            isCloned: true,
            sharedWithUsers: [],
            createdBy: {
              _id: user._id,
              username: user.username,
            },
          });
        }
        break;

      case 'deck':
        originalResource = await this.deckModel.findOne({
          _id: resourceId,
          sharedWithUsers: { $in: [user._id] },
        });
        if (!originalResource) {
          throw new NotFoundException('Not found deck');
        }
        originalResourceObject = originalResource.toObject();
        delete originalResourceObject._id;
        let newDeckName = originalResourceObject.name;
        delete originalResourceObject.name;

        //Check duplicate deck name
        const existingDecks = await this.deckModel.find({ userId: user._id });
        const existingDeckNames = existingDecks.map((deck) => deck.name);
        newDeckName = handleDuplicateName(newDeckName, existingDeckNames);

        newResource = await this.deckModel.create({
          name: newDeckName,
          ...originalResourceObject,
          userId: user._id,
          isCloned: true,
          sharedWithUsers: [],
          createdBy: {
            _id: user._id,
            username: user.username,
          },
        });

        const originalFlashcards = await this.flashcardModel.find({
          deckId: resourceId,
          sharedWithUsers: { $in: [user._id] },
        });
        if (originalFlashcards) {
          const newFlashcards = originalFlashcards.map((card) => {
            const cardObject = card.toObject();
            delete cardObject._id;
            return {
              ...cardObject,
              userId: user._id,
              deckId: newResource._id,
              isCloned: true,
              sharedWithUsers: [],
              createdBy: {
                _id: user._id,
                username: user.username,
              },
            };
          });
          const cloneFlashcards =
            await this.flashcardModel.insertMany(newFlashcards);

          const flashcardReviews = cloneFlashcards.map((flashcard) => ({
            flashcardId: flashcard._id,
            userId: user._id,
            isCloned: true,
            createdBy: {
              _id: user._id,
              username: user.username,
            },
          }));
          await this.flashcardReviewModel.insertMany(flashcardReviews);
        }
        break;

      case 'quiz':
        originalResource = await this.quizTestModel.findOne({
          _id: resourceId,
          sharedWithUsers: { $in: [user._id] },
        });
        if (!originalResource) {
          throw new NotFoundException('Not found quiz');
        }
        originalResourceObject = originalResource.toObject();
        delete originalResourceObject._id;
        let newQuizName = originalResourceObject.name;
        delete originalResourceObject.name;

        //Check duplicate quiz name
        const existingQuizzes = await this.quizTestModel.find({
          userId: user._id,
        });
        const existingQuizNames = existingQuizzes.map((quiz) => quiz.name);
        newQuizName = handleDuplicateName(newQuizName, existingQuizNames);

        newResource = await this.quizTestModel.create({
          name: newQuizName,
          ...originalResourceObject,
          userId: user._id,
          isCloned: true,
          sharedWithUsers: [],
          createdBy: {
            _id: user._id,
            username: user.username,
          },
        });

        const originalQuestions = await this.quizQuestionModel.find({
          quizTestId: resourceId,
          sharedWithUsers: { $in: [user._id] },
        });
        if (originalQuestions) {
          const newQuestions = originalQuestions.map((question) => {
            const questionObject = question.toObject();
            delete questionObject._id;
            return {
              ...questionObject,
              userId: user._id,
              quizTestId: newResource._id,
              isCloned: true,
              sharedWithUsers: [],
              createdBy: {
                _id: user._id,
                username: user.username,
              },
            };
          });
          await this.quizQuestionModel.insertMany(newQuestions);
        }
        break;

      default:
        throw new BadRequestException('Invalid resource type');
    }
    return {
      message: `${resourceType} was cloned successfully`,
      newResource,
    };
  }

  async findAllSharedResources(
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

  async findAllClonedResources(
    user: IUser,
    resourceType: string,
    currentPage: number,
    pageSize: number,
    qs: string,
  ) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    filter.isCloned = true;
    filter.userId = user._id;

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

  async findSharedResource(
    resourceType: string,
    resourceId: string,
    user: IUser,
  ) {
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

  async findClonedResource(
    resourceType: string,
    resourceId: string,
    user: IUser,
  ) {
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
      isCloned: true,
    });
    if (!resource) {
      throw new NotFoundException(`Not found ${resourceType}`);
    }
    const ownerId = resource.ownerId || resource.userId;
    if (ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    const relatedData = await relatedModel.find({ [relatedField]: resourceId });
    const resourceWithDetails = {
      ...resource.toObject(),
      related: relatedData,
    };
    return resourceWithDetails;
  }
}
