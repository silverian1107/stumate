import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CollectionsService } from 'src/collections/collections.service';
import { validateObjectId } from 'src/utils/validateId';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note, NoteDocument } from './models/note.models';
import { SortOptions } from 'src/utils/dtos/options.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Note')
    private readonly noteModel: Model<NoteDocument>,
    private readonly collectionService: CollectionsService,
  ) {}

  async create(newNoteData: CreateNoteDto) {
    validateObjectId([newNoteData.ownerId, newNoteData.parentId]);

    try {
      const newNote = new this.noteModel(newNoteData);
      const { parentId } = newNoteData;

      const [parentNote, parentCollection] = await Promise.all([
        this.noteModel.findById(parentId),
        this.collectionService.findById(parentId).catch(() => {
          return null;
        }),
      ]);

      const parent = parentNote || parentCollection;
      if (!parent) {
        throw new NotFoundException(
          `Couldn't find the parent with ID: ${parentId}`,
        );
      }

      newNote.parentId = {
        _id: parent._id as string,
        type: parentNote ? 'Note' : 'Collection',
      };
      parent.children.push({
        _id: newNote._id as string,
        type: 'Note',
      });

      newNote.position = parent.children.length;
      newNote.level = parent.level + 1;

      await parent.save();
      return await newNote.save();
    } catch (error) {
      throw new Error(`Failed to create note: ${error.message}`);
    }
  }

  async findAll({
    sortBy = 'position',
    order = 'asc',
  }: SortOptions = {}): Promise<Note[]> {
    const sortOrder = order === 'asc' ? 1 : -1;

    try {
      const notes = await this.noteModel
        .find({
          'parentId.type': 'Collection',
          isArchived: false,
          isDeleted: false,
        })
        .sort({ [sortBy]: sortOrder })
        .populate('childrenDocs')
        .lean<Note[]>()
        .exec();
      return notes;
    } catch (error) {
      throw new Error(`Failed to search notes: ${error.message}`);
    }
  }

  async findByOwnerId(
    ownerId: string,
    { sortBy = 'position', order = 'asc' }: SortOptions = {},
  ): Promise<Note[]> {
    validateObjectId(ownerId);
    const sortOrder = order === 'asc' ? 1 : -1;

    try {
      const notes = await this.noteModel
        .find({
          ownerId,
          'parentId.type': 'Collection',
          isArchived: false,
          isDeleted: false,
        })
        .sort({ [sortBy]: sortOrder })
        .populate('childrenDocs')
        .lean<Note[]>()
        .exec();

      return notes;
    } catch (error) {
      throw new Error(`Failed to search notes: ${error.message}`);
    }
  }

  async findById(noteId: string): Promise<Note> {
    validateObjectId(noteId, 'Collection');
    const collection = await this.noteModel
      .findById(noteId)
      .populate('childrenDocs')
      .lean<Note>()
      .exec();
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${noteId} not found`);
    }
    return collection;
  }

  async updateById(noteId: string, updateData: UpdateNoteDto) {
    validateObjectId(noteId, 'Collection');
    const updatedCollection = await this.noteModel
      .findByIdAndUpdate(noteId, updateData, { new: true })
      .exec();
    if (!updatedCollection) {
      throw new NotFoundException(`Collection with ID ${noteId} not found`);
    }
    return updatedCollection;
  }

  async archiveById(noteId: string) {
    validateObjectId(noteId, 'Note');
    const archiveNote = await this.noteModel.findById(noteId).exec();

    if (!archiveNote) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    archiveNote.isArchived = true;
    return archiveNote.save();
  }

  async restoreById(noteId: string) {
    validateObjectId(noteId, 'Note');
    const restoredNote = await this.noteModel.findById(noteId).exec();

    if (!restoredNote) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    restoredNote.isArchived = false;
    return restoredNote.save();
  }

  async deleteById(noteId: string) {
    validateObjectId(noteId, 'Note');
    const deletedNote = await this.noteModel.findById(noteId).exec();

    if (!deletedNote) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    if (!deletedNote.isArchived) {
      throw new BadRequestException('Note must be archived before delete');
    }

    deletedNote.isDeleted = true;
    return deletedNote.save();
  }
}
