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
  ) {}

  async handlePublishResource(resourceType: string, resourceId: string) {
    switch (resourceType) {
      case 'collection':
        return await this.collectionModel.findOneAndUpdate(
          { id: resourceId },
          { isPublished: true },
          { new: true },
        );
      case 'note':
        return await this.noteModel.findOneAndUpdate(
          { id: resourceId },
          { isPublished: true },
          { new: true },
        );
      case 'deck':
        return await this.deckModel.findOneAndUpdate(
          { id: resourceId },
          { isPublished: true },
          { new: true },
        );
      case 'quiz':
        return await this.quizTestModel.findOneAndUpdate(
          { id: resourceId },
          { isPublished: true },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async handleUnpublishResource(resourceType: string, resourceId: string) {
    switch (resourceType) {
      case 'collection':
        return await this.collectionModel.findOneAndUpdate(
          { id: resourceId },
          { isPublished: false },
          { new: true },
        );
      case 'note':
        return await this.noteModel.findOneAndUpdate(
          { id: resourceId },
          { isPublished: false },
          { new: true },
        );
      case 'deck':
        return await this.deckModel.findOneAndUpdate(
          { id: resourceId },
          { isPublished: false },
          { new: true },
        );
      case 'quiz':
        return await this.quizTestModel.findOneAndUpdate(
          { id: resourceId },
          { isPublished: false },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async handleShareResourceWithUser(
    resourceType: string,
    resourceId: string,
    usernameOrEmail: string,
  ) {
    const user = await this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      throw new NotFoundException('Not found user');
    }
    switch (resourceType) {
      case 'collection':
        return await this.collectionModel.findOneAndUpdate(
          { id: resourceId },
          { $addToSet: { sharedWithUsers: user._id } },
          { new: true },
        );
      case 'note':
        return await this.noteModel.findOneAndUpdate(
          { id: resourceId },
          { $addToSet: { sharedWithUsers: user._id } },
          { new: true },
        );
      case 'deck':
        return await this.deckModel.findOneAndUpdate(
          { id: resourceId },
          { $addToSet: { sharedWithUsers: user._id } },
          { new: true },
        );
      case 'quiz':
        return await this.quizTestModel.findOneAndUpdate(
          { id: resourceId },
          { $addToSet: { sharedWithUsers: user._id } },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async handleRemoveSharedResourceWithUser(
    resourceType: string,
    resourceId: string,
    usernameOrEmail: string,
  ) {
    const user = await this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    switch (resourceType) {
      case 'collection':
        return await this.collectionModel.findOneAndUpdate(
          { id: resourceId },
          { $pull: { sharedWithUsers: user._id } },
          { new: true },
        );
      case 'note':
        return await this.noteModel.findOneAndUpdate(
          { id: resourceId },
          { $pull: { sharedWithUsers: user._id } },
          { new: true },
        );
      case 'deck':
        return await this.deckModel.findOneAndUpdate(
          { id: resourceId },
          { $pull: { sharedWithUsers: user._id } },
          { new: true },
        );
      case 'quiz':
        return await this.quizTestModel.findOneAndUpdate(
          { id: resourceId },
          { $pull: { sharedWithUsers: user._id } },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }
}
