import { SummaryDocument } from './../summaries/schema/summary.schema';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, NoteDocument } from './schema/note.schema';
import { CollectionsService } from '../collections/collections.service';
import { validateObjectId } from 'src/helpers/utils';
import { StatisticsService } from '../statistics/statistics.service';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Note')
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel('Summary')
    private readonly summaryModel: SoftDeleteModel<SummaryDocument>,
    private readonly collectionService: CollectionsService,
    private readonly statisticsService: StatisticsService,
  ) {}

  async create(newNoteData: CreateNoteDto, userId: string) {
    if (!mongoose.isValidObjectId(newNoteData.parentId))
      throw new BadRequestException('Invalid Collection ID');
    if (!mongoose.isValidObjectId(userId))
      throw new BadRequestException('Invalid UserId ID');

    try {
      const newNote = new this.noteModel({
        ...newNoteData,
        ownerId: userId,
      });
      const { parentId } = newNoteData;

      const [parentNote, parentCollection] = await Promise.all([
        this.noteModel.findOne({ _id: parentId }),
        this.collectionService.findById(parentId, userId).catch(() => {
          return null;
        }),
      ]);

      const parent = parentNote || parentCollection;
      if (!parent)
        throw new NotFoundException(
          `Couldn't find the collection with ID: ${parentId}`,
        );

      newNote.parentId = parent._id as string;
      parent.children.push({
        _id: newNote._id as string,
        type: 'Note',
      });

      newNote.position = parent.children.length;
      newNote.level = parent.level + 1;

      await parent.save();
      await newNote.save();
      await this.statisticsService.createOrUpdateUserStatistics(userId);
      return newNote;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create note: ${error.message}`,
      );
    }
  }

  async findAll(
    currentPage = 1,
    pageSize = 10,
    // qs?: string
  ) {
    if (!Number.isInteger(currentPage) || currentPage <= 0) {
      throw new BadRequestException('Current page must be a positive integer');
    }
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      throw new BadRequestException('Page size must be a positive integer');
    }
    // const { sort } = qs ? aqp(qs) : { sort: { position: -1 } };
    const limit = pageSize;
    const skip = (currentPage - 1) * limit;

    try {
      const totalItems = await this.noteModel.countDocuments().exec();
      const totalPages = Math.ceil(totalItems / limit);
      const notes = await this.noteModel
        .aggregate([
          {
            $lookup: {
              from: 'collections',
              localField: 'parentId',
              foreignField: '_id',
              as: 'parentCollection',
            },
          },
          {
            $unwind: {
              path: '$parentCollection',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              'parentCollection.type': 'Collection',
              isArchived: false,
              isDeleted: false,
            },
          },
          // { $sort: sort as any },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'notes',
              localField: 'children._id',
              foreignField: '_id',
              as: 'childrenDocs',
            },
          },
          { $project: { parentCollection: 0 } },
        ])
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
    // qs?: string,
  ) {
    if (!Number.isInteger(currentPage) || currentPage <= 0)
      throw new BadRequestException('Current page must be a positive integer');
    if (!Number.isInteger(pageSize) || pageSize <= 0)
      throw new BadRequestException('Page size must be a positive integer');

    if (!mongoose.isValidObjectId(ownerId))
      throw new BadRequestException('Invalid UserId');

    // const { sort } = qs ? aqp(qs) : { sort: { position: -1 } };
    const limit = pageSize || 10;
    // const skip = (currentPage - 1) * limit;

    // Define the filter to find notes by ownerId
    const filter = {
      ownerId,
    };
    console.log(ownerId);

    try {
      // Count total items matching the filter
      const totalItems = await this.noteModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit);
      const notes = await this.noteModel.find(filter);

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

  async findById(ownerId: string, noteId: string): Promise<Note> {
    if (!mongoose.isValidObjectId(ownerId))
      throw new BadRequestException('Invalid UserId');
    if (!mongoose.isValidObjectId(noteId))
      throw new BadRequestException('Invalid NoteId');

    const collection = await this.noteModel
      .findOne({ _id: noteId })
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
      .findOneAndUpdate({ _id: noteId }, { updateData }, { new: true })
      .exec();
    if (!updatedCollection) {
      throw new NotFoundException(`Collection with ID ${noteId} not found`);
    }
    return updatedCollection;
  }

  //websocket
  async deleteById(noteId: string) {
    validateObjectId(noteId, 'Note');
    const deletedNote = await this.noteModel.findOne({ _id: noteId });
    if (!deletedNote) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    const ownerId = deletedNote.ownerId;

    const notesToDelete = [];
    const stack = [noteId];

    while (stack.length > 0) {
      const currentNoteId = stack.pop();
      const currentNote = await this.noteModel.findOne({ _id: currentNoteId });

      if (currentNote) {
        notesToDelete.push(currentNote._id);
        const childNotes = await this.noteModel.find({
          'parentId._id': currentNoteId,
        });
        stack.push(...childNotes.map((child) => child._id.toString()));
      }
    }

    await this.summaryModel.delete({ noteId: { $in: notesToDelete } }, ownerId);
    await this.noteModel.delete({ _id: { $in: notesToDelete } }, ownerId);

    await this.statisticsService.createOrUpdateUserStatistics(ownerId);
    return 'Note was deleted successfully';
  }
}
