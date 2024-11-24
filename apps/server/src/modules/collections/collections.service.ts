import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Collection, CollectionDocument } from './schema/collection.schema';

import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

import aqp from 'api-query-params';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: Model<CollectionDocument>,
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
        const parent = await this.collectionModel.findById(
          newCollection.parentId,
        );
        if (!parent) {
          throw new NotFoundException("Couldn't find the parent id");
        }

        if (userId !== parent.ownerId.toString()) {
          throw new UnauthorizedException(
            'You are not authorized to perform this action.',
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
    const filter = { level: 0, isArchived: false, isDeleted: false };

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
    const limit = pageSize || 10;
    const skip = (currentPage - 1) * limit;

    try {
      const filter = {
        ownerId: userId,
        level: 0,
        isArchived: false,
        // isDeleted: false,
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
    if (!mongoose.isValidObjectId(ownerId)) {
      throw new BadRequestException('Invalid UserId');
    }
    if (!Number.isInteger(currentPage) || currentPage <= 0) {
      throw new BadRequestException('Current page must be a positive integer');
    }
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      throw new BadRequestException('Page size must be a positive integer');
    }

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
      throw new InternalServerErrorException(
        `Failed to fetch archived collections by owner ID: ${error.message}`,
      );
    }
  }

  async findById(collectionId: string, userId: string): Promise<Collection> {
    if (!mongoose.isValidObjectId(collectionId))
      throw new BadRequestException('Invalid CollectionId');
    if (!mongoose.isValidObjectId(userId))
      throw new BadRequestException('Invalid UserId');

    const collection = await this.collectionModel
      .findOne({ _id: collectionId, ownerId: userId })
      .populate('childrenDocs')
      .exec();
    if (!collection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }

    return collection;
  }

  async updateById(
    collectionId: string,
    userId: string,
    updateData: UpdateCollectionDto,
  ) {
    if (!mongoose.isValidObjectId(collectionId))
      throw new BadRequestException('Invalid CollectionId');
    if (!mongoose.isValidObjectId(userId))
      throw new BadRequestException('Invalid UserId');

    const updatedCollection = await this.collectionModel
      .findOneAndUpdate(
        {
          _id: collectionId,
          ownerId: userId,
        },
        updateData,
        {
          new: true,
        },
      )
      .exec();
    if (!updatedCollection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    return updatedCollection;
  }

  async archiveById(collectionId: string, userId: string) {
    if (!mongoose.isValidObjectId(collectionId))
      throw new BadRequestException('Invalid CollectionId');
    if (!mongoose.isValidObjectId(userId))
      throw new BadRequestException('Invalid UserId');

    const archivedCollection = await this.collectionModel
      .findOne({
        _id: collectionId,
        ownerId: userId,
      })
      .exec();

    if (!archivedCollection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    archivedCollection.isArchived = true;
    await archivedCollection.save();
  }

  async restoreById(collectionId: string, userId: string) {
    if (!mongoose.isValidObjectId(collectionId))
      throw new BadRequestException('Invalid CollectionId');
    if (!mongoose.isValidObjectId(userId))
      throw new BadRequestException('Invalid UserId');

    const restoredCollection = await this.collectionModel
      .findOne({
        _id: collectionId,
        ownerId: userId,
      })
      .exec();

    if (!restoredCollection || restoredCollection.isDeleted) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }

    restoredCollection.isArchived = false;
    await restoredCollection.save();
  }

  async deleteById(collectionId: string, userId: string) {
    if (!mongoose.isValidObjectId(collectionId))
      throw new BadRequestException('Invalid CollectionId');
    if (!mongoose.isValidObjectId(userId))
      throw new BadRequestException('Invalid UserId');

    const deletedCollection = await this.collectionModel
      .findOne({
        _id: collectionId,
        ownerId: userId,
      })
      .exec();

    if (!deletedCollection) {
      throw new NotFoundException(`Collection not found`);
    }
    if (!deletedCollection.isArchived) {
      throw new BadRequestException(
        'Collection must be archived before delete',
      );
    }

    deletedCollection.deletedAt = new Date();
    deletedCollection.isDeleted = true;
    await deletedCollection.save();
  }
}
