import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { Model } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, NoteDocument } from './schema/note.schema';
import { CollectionsService } from '../collections/collections.service';
import { validateObjectId } from 'src/helpers/utils';

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

  async findAll(currentPage = 1, pageSize = 10, qs?: string) {
    if (!Number.isInteger(currentPage) || currentPage <= 0) {
      throw new BadRequestException('Current page must be a positive integer');
    }
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      throw new BadRequestException('Page size must be a positive integer');
    }
    const { sort } = qs ? aqp(qs) : { sort: { position: -1 } };
    const limit = pageSize;
    const skip = (currentPage - 1) * limit;
    const filter = {
      'parentId.type': 'Collection',
      isArchived: false,
      isDeleted: false,
    };

    try {
      const totalItems = await this.noteModel.countDocuments(filter).exec();
      const totalPages = Math.ceil(totalItems / limit);
      const notes = await this.noteModel
        .find(filter)
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .select('-ownerId')
        .populate('childrenDocs')
        .lean<Note[]>()
        .exec();

      return {
        meta: {
          current: currentPage,
          pageSize: limit,
          pages: totalPages,
          total: totalItems,
        },
        result: notes,
      };
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid request data');
      }
      throw new Error(`Failed to search notes: ${error.message}`);
    }
  }

  async findByOwnerId(
    ownerId: string,
    currentPage = 1,
    pageSize = 10,
    qs?: string,
  ) {
    validateObjectId(ownerId, 'User');
    const { sort } = qs ? aqp(qs) : { sort: { position: -1 } };
    const limit = pageSize || 10;
    const skip = (currentPage - 1) * limit;
    const filter = {
      ownerId,
      'parentId.type': 'Collection',
      isArchived: false,
      isDeleted: false,
    };

    try {
      const totalItems = await this.noteModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit);
      const notes = await this.noteModel
        .find(filter)
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .populate('childrenDocs')
        .lean<Note[]>()
        .exec();

      return {
        meta: {
          current: currentPage,
          pageSize: limit,
          pages: totalPages,
          total: totalItems,
        },
        result: notes,
      };
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
