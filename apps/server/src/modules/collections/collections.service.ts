import { SoftDeleteModel } from 'mongoose-delete';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Collection, CollectionDocument } from './schema/collection.schema';

import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

import aqp from 'api-query-params';
import { NoteDocument } from '../notes/schema/note.schema';
import { SummaryDocument } from '../summaries/schema/summary.schema';
import { IUser } from '../users/users.interface';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: SoftDeleteModel<CollectionDocument>,
    @InjectModel('Note')
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel('Summary')
    private readonly summaryModel: SoftDeleteModel<SummaryDocument>,
    private readonly statisticsService: StatisticsService,
  ) {}

  async create(
    newCollectionData: CreateCollectionDto,
    userId: string,
  ): Promise<CollectionDocument> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid UserId');
    }
    try {
      const newCollection = new this.collectionModel({
        ...newCollectionData,
        ownerId: userId,
      });

      if (newCollection.parentId) {
        const parent = await this.collectionModel.findOne({
          _id: newCollection.parentId,
        });

        if (!parent) {
          throw new NotFoundException("Couldn't find the parent id");
        }
        if (parent.ownerId.toString() !== userId) {
          throw new ForbiddenException(
            `You don't have permission to access this resource`,
          );
        }

        parent.children.push({
          _id: newCollection._id as string,
          type: 'Collection',
        });
        newCollection.position = parent.children.length;
        newCollection.level = parent.level + 1;
        await parent.save();
      } else {
        const totalCollection = await this.collectionModel.countDocuments({
          level: 0,
        });
        newCollection.position = totalCollection + 1;
      }
      return newCollection.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of documents from the collection based on the provided query string.
   *
   * @param currentPage - The current page number (must be a positive integer, default is 1).
   * @param pageSize - The number of items per page (must be a positive integer, default is 10).
   * @param qs - The query string for sorting and filtering the results.
   * @returns A promise that resolves to an object containing pagination metadata and the result array.
   * @throws BadRequestException if currentPage or pageSize is not a positive integer.
   * @throws Error if the fetch operation fails.
   *
   * TODO: Restricted to admin users only.
   */
  async findAll(
    currentPage = 1,
    pageSize = 10,
    qs?: string,
  ): Promise<{
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: any[];
  }> {
    // Input validation
    if (!Number.isInteger(currentPage) || currentPage <= 0) {
      throw new BadRequestException('Current page must be a positive integer');
    }
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      throw new BadRequestException('Page size must be a positive integer');
    }

    const { sort } = qs ? aqp(qs) : { sort: { position: -1 } };
    const limit = pageSize || 10;
    const skip = (currentPage - 1) * limit;
    const filter = { level: 0 };

    try {
      const totalItems = await this.collectionModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit);
      const result = await this.collectionModel
        .find(filter)
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        // .select('-ownerId')
        .populate('childrenDocs')
        .lean()
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
    } catch (error) {
      throw error;
    }
  }

  async findByOwnerId(
    userId: string,
    currentPage = 1,
    pageSize = 10,
    qs?: string,
  ) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid UserId');
    }
    if (!Number.isInteger(currentPage) || currentPage <= 0) {
      throw new BadRequestException('Current page must be a positive integer');
    }
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      throw new BadRequestException('Page size must be a positive integer');
    }

    const { sort } = qs ? aqp(qs) : { sort: { position: -1 } }; // Default sorting by createdAt if qs is not provided

    try {
      const filter = {
        ownerId: userId,
        level: 0,
      };

      const result = await this.collectionModel
        .find(filter)
        .sort(sort as any)
        .populate('childrenDocs')
        .lean<Collection[]>()
        .exec();

      return {
        result,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch collections by owner ID: ${error.message}`,
      );
    }
  }

  async findAllArchivedByOwnerId(ownerId: string): Promise<Collection[]> {
    if (!mongoose.isValidObjectId(ownerId)) {
      throw new BadRequestException('Invalid UserId');
    }

    try {
      return await this.collectionModel
        .find({
          ownerId,
          level: 0,
          isArchived: true,
        })
        .populate('childrenDocs')
        .lean<Collection[]>()
        .exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to fetch archived collections by owner ID: ${error.message}`,
      );
    }
  }

  async findById(collectionId: string): Promise<Collection> {
    if (!mongoose.isValidObjectId(collectionId))
      throw new BadRequestException('Invalid CollectionId');

    const collection = await this.collectionModel
      .findOne({ _id: collectionId })
      .populate('childrenDocs')
      .exec();
    if (!collection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    return collection;
  }

  async updateById(collectionId: string, updateData: UpdateCollectionDto) {
    const updatedCollection = await this.collectionModel
      .findOneAndUpdate(
        {
          _id: collectionId,
        },
        updateData,
        {
          new: true,
        },
      )
      .exec();
    return updatedCollection;
  }

  async deleteById(collectionId: string, user: IUser) {
    if (!mongoose.isValidObjectId(collectionId))
      throw new BadRequestException('Invalid CollectionId');

    const deletedCollection = await this.collectionModel
      .findOne({
        _id: collectionId,
        isArchived: true,
      })
      .exec();

    if (!deletedCollection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    const ownerId = deletedCollection.ownerId.toString();
    if (user.role === 'USER') {
      if (ownerId !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }

    const collectionsToDelete = [];
    const notesToDelete = [];
    const stack = [collectionId];

    while (stack.length > 0) {
      const currentCollectionId = stack.pop();
      const currentCollection = await this.collectionModel.findOne({
        _id: currentCollectionId,
        isArchived: true,
      });

      if (currentCollection) {
        collectionsToDelete.push(currentCollection._id);
        for (const child of currentCollection.children) {
          if (child.type === 'Collection') {
            stack.push(child._id);
          } else if (child.type === 'Note') {
            notesToDelete.push(child._id);
            const stackNotes = [child._id];
            while (stackNotes.length > 0) {
              const currentNoteId = stackNotes.pop();
              const currentNote = await this.noteModel.findOne({
                _id: currentNoteId,
                isArchived: true,
              });

              if (currentNote) {
                notesToDelete.push(currentNote._id);
                const childNotes = await this.noteModel.find({
                  parentId: currentNoteId,
                  isArchived: true,
                });
                stackNotes.push(
                  ...childNotes.map((child) => child._id.toString()),
                );
              }
            }
          }
        }
      }
    }

    await this.summaryModel.delete(
      {
        noteId: { $in: notesToDelete },
      },
      user._id,
    );
    await this.noteModel.delete({ _id: { $in: notesToDelete } }, user._id);

    await this.collectionModel.delete(
      { _id: { $in: collectionsToDelete } },
      user._id,
    );

    await this.statisticsService.createOrUpdateUserStatistics(ownerId);

    return 'Collection was deleted successfully';
  }
}
