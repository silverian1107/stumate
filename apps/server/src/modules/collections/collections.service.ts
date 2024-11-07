import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection, CollectionDocument } from './schema/collection.schema';

import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

import aqp from 'api-query-params';
import { validateObjectId } from 'src/helpers/utils';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: Model<CollectionDocument>,
  ) {}

  async create(
    newCollectionData: CreateCollectionDto,
  ): Promise<CollectionDocument> {
    try {
      const newCollection = new this.collectionModel(newCollectionData);

      if ('parentId' in newCollectionData) {
        const parent = await this.collectionModel.findById(
          newCollection.parentId,
        );

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
    const filter = { level: 0, isArchived: false, isDeleted: false };

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
        isArchived: false,
        isDeleted: false,
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
      .findById(collectionId)
      .populate('childrenDocs')
      .exec();
    if (!collection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    return collection;
  }

  async findArchivedByOwnerId(
    ownerId: string,
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
    result: Collection[];
  }> {
    validateObjectId(ownerId, 'User');

    const { sort } = qs ? aqp(qs) : { sort: { position: -1 } };
    const limit = pageSize || 10;
    const skip = (currentPage - 1) * limit;

    try {
      const result = await this.collectionModel
        .find({
          ownerId,
          level: 0,
          isArchived: true,
          isDeleted: false,
        })
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .populate('childrenDocs')
        .lean<Collection[]>()
        .exec();

      const totalItems = await this.collectionModel.countDocuments({
        ownerId,
        level: 0,
        isArchived: true,
        isDeleted: false,
      });

      const totalPages = Math.ceil(totalItems / limit);

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
        `Failed to fetch archived collections by owner ID: ${error.message}`,
      );
    }
  }

  async updateById(collectionId: string, updateData: UpdateCollectionDto) {
    validateObjectId(collectionId, 'Collection');
    const updatedCollection = await this.collectionModel
      .findByIdAndUpdate(collectionId, updateData, { new: true })
      .exec();
    if (!updatedCollection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    return updatedCollection;
  }

  async archiveById(collectionId: string) {
    validateObjectId(collectionId, 'Collection');
    const archivedCollection = await this.collectionModel
      .findById(collectionId)
      .exec();

    if (!archivedCollection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    archivedCollection.isArchived = true;
    return archivedCollection.save();
  }

  async restoreById(collectionId: string) {
    validateObjectId(collectionId, 'Collection');
    const restoredCollection = await this.collectionModel
      .findById(collectionId)
      .exec();

    if (!restoredCollection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }

    restoredCollection.isArchived = false;
    return restoredCollection.save();
  }

  async deleteById(collectionId: string) {
    validateObjectId(collectionId, 'Collection');
    const deletedCollection = await this.collectionModel
      .findById(collectionId)
      .exec();

    if (!deletedCollection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    if (!deletedCollection.isArchived) {
      throw new BadRequestException(
        'Collection must be archived before delete',
      );
    }

    deletedCollection.isDeleted = true;
    return deletedCollection.save();
  }
}
