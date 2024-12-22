import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagDocument } from './schema/tag.schema';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import mongoose from 'mongoose';
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
import { SoftDeleteModel } from 'mongoose-delete';
import { UsersService } from '../users/users.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: SoftDeleteModel<TagDocument>,
    @InjectModel(Collection.name)
    private readonly collectionModel: SoftDeleteModel<CollectionDocument>,
    @InjectModel(Note.name)
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel(Deck.name)
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel(QuizTest.name)
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    private readonly usersService: UsersService,
  ) {}

  async checkOwnership(
    resourceType: string,
    resourceId: string,
    userId: string,
  ) {
    let resource: any;
    switch (resourceType) {
      case 'collections':
        resource = await this.collectionModel.findOne({ _id: resourceId });
        break;
      case 'notes':
        resource = await this.noteModel.findOne({ _id: resourceId });
        break;
      case 'decks':
        resource = await this.deckModel.findOne({ _id: resourceId });
        break;
      case 'quiz-tests':
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

  async handleAddTag(
    resourceType: string,
    resourceId: string,
    id: string,
    user: IUser,
  ) {
    const tag = await this.tagModel.findOne({ _id: id });
    if (!tag) {
      throw new NotFoundException('Not found tag');
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
      case 'collections':
        return await this.collectionModel.findOneAndUpdate(
          { _id: resourceId },
          { $addToSet: { tags: id } },
          { new: true },
        );
      case 'notes':
        return await this.noteModel.findOneAndUpdate(
          { _id: resourceId },
          { $addToSet: { tags: id } },
          { new: true },
        );
      case 'decks':
        return await this.deckModel.findOneAndUpdate(
          { _id: resourceId },
          { $addToSet: { tags: id } },
          { new: true },
        );
      case 'quizzes':
        return await this.quizTestModel.findOneAndUpdate(
          { _id: resourceId },
          { $addToSet: { tags: id } },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async handleUnassignTag(
    resourceType: string,
    resourceId: string,
    id: string,
    user: IUser,
  ) {
    const tag = await this.tagModel.findOne({ _id: id });
    if (!tag) {
      throw new NotFoundException('Not found tag');
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
      case 'collections':
        return await this.collectionModel.findOneAndUpdate(
          { _id: resourceId },
          { $pull: { tags: id } },
          { new: true },
        );
      case 'notes':
        return await this.noteModel.findOneAndUpdate(
          { _id: resourceId },
          { $pull: { tags: id } },
          { new: true },
        );
      case 'decks':
        return await this.deckModel.findOneAndUpdate(
          { _id: resourceId },
          { $pull: { tags: id } },
          { new: true },
        );
      case 'quiz-tests':
        return await this.quizTestModel.findOneAndUpdate(
          { _id: resourceId },
          { $pull: { tags: id } },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async create(createTagDto: CreateTagDto, @User() user: IUser) {
    const { name } = createTagDto;
    //Check name already exists
    const tagName = await this.tagModel.findOne({ name, userId: user._id });
    if (tagName) {
      throw new ConflictException(`Name '${name}' already exists`);
    }
    //Create a new tag
    const newTag = await this.tagModel.create({
      name,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newTag;
  }

  async findAll(@User() user: IUser) {
    const allTags = await this.tagModel.find();

    if (user.role === 'ADMIN') {
      return {
        allTags,
      };
    }

    const userTags = allTags.filter(
      (tag) => tag.userId.toString() === user._id,
    );
    const adminIds = await this.usersService.findAllAdminIds();
    const adminTags = allTags.filter((tag) =>
      adminIds.includes(tag.userId.toString()),
    );

    return {
      userTags,
      combinedTags: [...userTags, ...adminTags],
    };
  }

  async searchByName(name: string, user: IUser) {
    const allTags = await this.tagModel.find({
      name: { $regex: name, $options: 'i' },
    });

    if (user.role === 'ADMIN') {
      return {
        allTags,
      };
    }

    const userTags = allTags.filter(
      (tag) => tag.userId.toString() === user._id,
    );
    const adminIds = await this.usersService.findAllAdminIds();
    const adminTags = allTags.filter((tag) =>
      adminIds.includes(tag.userId.toString()),
    );

    return {
      results: [...userTags, ...adminTags],
    };
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Tag ID');
    }
    const tag = await this.tagModel.findOne({ _id: id });
    if (!tag) {
      throw new NotFoundException('Not found tag');
    }
    return tag;
  }

  async update(id: string, createTagDto: CreateTagDto, @User() user: IUser) {
    return await this.tagModel.findOneAndUpdate(
      { _id: id },
      {
        ...createTagDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
  }

  async remove(id: string, @User() user: IUser) {
    await Promise.all([
      this.collectionModel.updateMany({ tags: id }, { $pull: { tags: id } }),
      this.noteModel.updateMany({ tags: id }, { $pull: { tags: id } }),
      this.deckModel.updateMany({ tags: id }, { $pull: { tags: id } }),
      this.quizTestModel.updateMany({ tags: id }, { $pull: { tags: id } }),
    ]);
    return this.tagModel.delete({ _id: id }, user._id);
  }
}
