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

  // async handlePublishResource(resourceType: string, resourceId: string) {
  //   switch (resourceType) {
  //     case 'collection':
  //       return await this.collectionModel.findOneAndUpdate(
  //         { id: resourceId },
  //         { isPublished: true },
  //         { new: true },
  //       );
  //     case 'note':
  //       return await this.noteModel.findOneAndUpdate(
  //         { id: resourceId },
  //         { isPublished: true },
  //         { new: true },
  //       );
  //     case 'deck':
  //       return await this.deckModel.findOneAndUpdate(
  //         { id: resourceId },
  //         { isPublished: true },
  //         { new: true },
  //       );
  //     case 'quiz':
  //       return await this.quizTestModel.findOneAndUpdate(
  //         { id: resourceId },
  //         { isPublished: true },
  //         { new: true },
  //       );
  //     default:
  //       throw new BadRequestException('Invalid resource type');
  //   }
  // }

  // async handleUnpublishResource(resourceType: string, resourceId: string) {
  //   switch (resourceType) {
  //     case 'collection':
  //       return await this.collectionModel.findOneAndUpdate(
  //         { id: resourceId },
  //         { isPublished: false },
  //         { new: true },
  //       );
  //     case 'note':
  //       return await this.noteModel.findOneAndUpdate(
  //         { id: resourceId },
  //         { isPublished: false },
  //         { new: true },
  //       );
  //     case 'deck':
  //       return await this.deckModel.findOneAndUpdate(
  //         { id: resourceId },
  //         { isPublished: false },
  //         { new: true },
  //       );
  //     case 'quiz':
  //       return await this.quizTestModel.findOneAndUpdate(
  //         { id: resourceId },
  //         { isPublished: false },
  //         { new: true },
  //       );
  //     default:
  //       throw new BadRequestException('Invalid resource type');
  //   }
  // }

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
      throw new NotFoundException('User not found');
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
}
