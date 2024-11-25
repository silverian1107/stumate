import { SoftDeleteModel } from 'mongoose-delete';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Collection, CollectionDocument } from './schema/collection.schema';

import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

import aqp from 'api-query-params';
import { validateObjectId } from 'src/helpers/utils';
import { NoteDocument } from '../notes/schema/note.schema';
import { SummaryDocument } from '../summaries/schema/summary.schema';
import { IUser } from '../users/users.interface';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: SoftDeleteModel<CollectionDocument>,
    @InjectModel('Note')
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel('Summary')
    private readonly summaryModel: SoftDeleteModel<SummaryDocument>,
  ) {}

  async create(
    newCollectionData: CreateCollectionDto,
  ): Promise<CollectionDocument> {
    try {
      const newCollection = new this.collectionModel(newCollectionData);

      if ('parentId' in newCollectionData) {
        const parent = await this.collectionModel.findOne({
          _id: newCollection.parentId,
        });

        if (!parent) {
          throw new NotFoundException("Couldn' find the parent id");
        }

        parent.children.push({
          _id: newCollection._id as string,
          type: 'Collection',
        });
        // Tính level và position
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
      throw new Error(`Failed to create collection: ${error.message}`);
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

    const { sort } = qs ? aqp(qs) : { sort: { position: -1 } }; // Default sorting by createdAt if qs is not provided
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
        .select('-ownerId')
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
      throw new Error(`Failed to fetch collections: ${error.message}`);
    }
  }

  async findByUser(user: IUser) {
    return await this.collectionModel.find({ userId: user._id });
  }

  async findByOwnerId(
    userId: string,
    currentPage = 1,
    pageSize = 10,
    qs?: string,
  ) {
    const { sort } = qs ? aqp(qs) : { sort: { position: -1 } }; // Default sorting by createdAt if qs is not provided
    const limit = pageSize || 10;
    const skip = (currentPage - 1) * limit;

    try {
      const filter = {
        ownerId: userId,
        level: 0,
      };

      const totalItems = await this.collectionModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit);

      const result = await this.collectionModel
        .find(filter)
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .populate('childrenDocs')
        .lean<Collection[]>()
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
      throw new Error(
        `Failed to fetch collections by owner ID: ${error.message}`,
      );
    }
  }

  async findById(collectionId: string): Promise<Collection> {
    validateObjectId(collectionId, 'Collection');
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
    validateObjectId(collectionId, 'Collection');
    const updatedCollection = await this.collectionModel
      .findOneAndUpdate({ _id: collectionId }, { updateData }, { new: true })
      .exec();
    if (!updatedCollection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    return updatedCollection;
  }

  async deleteById(collectionId: string) {
    validateObjectId(collectionId, 'Collection');
    const deletedCollection = await this.collectionModel.findOne({
      _id: collectionId,
    });

    if (!deletedCollection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }

    const ownerId = deletedCollection.ownerId;

    const collectionsToDelete = [];
    const notesToDelete = [];
    const stack = [collectionId];

    while (stack.length > 0) {
      const currentCollectionId = stack.pop();
      const currentCollection = await this.collectionModel.findOne({
        _id: currentCollectionId,
      });

      if (currentCollection) {
        collectionsToDelete.push(currentCollection._id);
        for (const child of currentCollection.children) {
          if (child.type === 'Collection') {
            stack.push(child._id.toString());
          } else if (child.type === 'Note') {
            notesToDelete.push(child._id.toString());
          }
        }
      }
    }

    await this.summaryModel.delete({ noteId: { $in: notesToDelete } }, ownerId);
    await this.noteModel.delete({ _id: { $in: notesToDelete } }, ownerId);

    await this.collectionModel.delete(
      { _id: { $in: collectionsToDelete } },
      ownerId,
    );

    return 'Collection was deleted successfully';
  }
}
