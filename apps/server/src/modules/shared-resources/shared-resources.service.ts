import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Collection,
  CollectionDocument,
} from '../collections/schema/collection.schema';
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

@Injectable()
export class SharedResourcesService {
  constructor(
    @InjectModel(Collection.name)
    private readonly collectionModel: SoftDeleteModel<CollectionDocument>,
    @InjectModel(Note.name)
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel(Deck.name)
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel(QuizTest.name)
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
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
      case 'collection':
        const sharedCollection = await this.collectionModel.findOneAndUpdate(
          { _id: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
          { new: true },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          sharedUser,
          `New Collection Shared`,
          `${user.username} has shared a collection with you. Check it out now!`,
        );
        return sharedCollection;
      case 'note':
        const sharedNote = await this.noteModel.findOneAndUpdate(
          { _id: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
          { new: true },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          sharedUser,
          `New Note Shared`,
          `${user.username} has shared a note with you. Check it out now!`,
        );
        return sharedNote;
      case 'deck':
        const sharedDeck = await this.deckModel.findOneAndUpdate(
          { _id: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
          { new: true },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          sharedUser,
          `New Deck Shared`,
          `${user.username} has shared a deck with you. Check it out now!`,
        );
        return sharedDeck;
      case 'quiz':
        const sharedQuiz = await this.quizTestModel.findOneAndUpdate(
          { _id: resourceId },
          { $addToSet: { sharedWithUsers: sharedUser._id } },
          { new: true },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          sharedUser,
          `New Quiz Shared`,
          `${user.username} has shared a quiz with you. Check it out now!`,
        );
        return sharedQuiz;
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
      case 'collection':
        const unsharedCollection = await this.collectionModel.findOneAndUpdate(
          { _id: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
          { new: true },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          unsharedUser,
          `Collection Unshared`,
          `${user.username} has unshared a collection with you.`,
        );
        return unsharedCollection;
      case 'note':
        const unsharedNote = await this.noteModel.findOneAndUpdate(
          { _id: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
          { new: true },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          unsharedUser,
          `Note Unshared`,
          `${user.username} has unshared a note with you.`,
        );
        return unsharedNote;
      case 'deck':
        const unsharedDeck = await this.deckModel.findOneAndUpdate(
          { _id: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
          { new: true },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          unsharedUser,
          `Deck Unshared`,
          `${user.username} has unshared a deck with you.`,
        );
        return unsharedDeck;
      case 'quiz':
        const unsharedQuiz = await this.quizTestModel.findOneAndUpdate(
          { _id: resourceId },
          { $pull: { sharedWithUsers: unsharedUser._id } },
          { new: true },
        );
        //send notification
        await this.notificationsService.sendInfoNotification(
          unsharedUser,
          `Quiz Unshared`,
          `${user.username} has unshared a quiz with you.`,
        );
        return unsharedQuiz;
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
}
