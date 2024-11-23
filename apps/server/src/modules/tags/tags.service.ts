import {
  BadRequestException,
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
  ) {}

  async handleAddTag(resourceType: string, resourceId: string, id: string) {
    const tag = await this.tagModel.findOne({ _id: id });
    if (!tag) {
      throw new NotFoundException('Not found tag');
    }
    switch (resourceType) {
      case 'collection':
        return await this.collectionModel.findOneAndUpdate(
          { id: resourceId },
          { $addToSet: { tags: id } },
          { new: true },
        );
      case 'note':
        return await this.noteModel.findOneAndUpdate(
          { id: resourceId },
          { $addToSet: { tags: id } },
          { new: true },
        );
      case 'deck':
        return await this.deckModel.findOneAndUpdate(
          { id: resourceId },
          { $addToSet: { tags: id } },
          { new: true },
        );
      case 'quiz':
        return await this.quizTestModel.findOneAndUpdate(
          { id: resourceId },
          { $addToSet: { tags: id } },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async handleRemoveTag(resourceType: string, resourceId: string, id: string) {
    const tag = await this.tagModel.findOne({ _id: id });
    if (!tag) {
      throw new NotFoundException('Not found tag');
    }
    switch (resourceType) {
      case 'collection':
        return await this.collectionModel.findOneAndUpdate(
          { id: resourceId },
          { $pull: { tags: id } },
          { new: true },
        );
      case 'note':
        return await this.noteModel.findOneAndUpdate(
          { id: resourceId },
          { $pull: { tags: id } },
          { new: true },
        );
      case 'deck':
        return await this.deckModel.findOneAndUpdate(
          { id: resourceId },
          { $pull: { tags: id } },
          { new: true },
        );
      case 'quiz':
        return await this.quizTestModel.findOneAndUpdate(
          { id: resourceId },
          { $pull: { tags: id } },
          { new: true },
        );
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async findByName(name: string) {
    return await this.tagModel.findOne({ name });
  }

  async create(createTagDto: CreateTagDto, @User() user: IUser) {
    const { name } = createTagDto;
    //Check name already exists
    if (await this.findByName(name)) {
      throw new BadRequestException(`Name '${name}' already exists`);
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
    return await this.tagModel.find({ userId: user._id });
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
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Tag ID');
    }
    const tag = await this.tagModel.findOne({ _id: id });
    if (!tag) {
      throw new NotFoundException('Not found tag');
    }
    await Promise.all([
      this.collectionModel.updateMany({ tags: id }, { $pull: { tags: id } }),
      this.noteModel.updateMany({ tags: id }, { $pull: { tags: id } }),
      this.deckModel.updateMany({ tags: id }, { $pull: { tags: id } }),
      this.quizTestModel.updateMany({ tags: id }, { $pull: { tags: id } }),
    ]);
    return this.tagModel.delete({ _id: id }, user._id);
  }
}
