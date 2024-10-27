import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionDocument } from './models/collection.model';
import { SortOptions } from './interfaces/options.interface';
import { UpdateCollectionDto } from './dto/update-collection.dto';

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

      if (newCollection.parentId) {
        const parent = await this.collectionModel.findById(
          newCollection.parentId,
        );

        if (!parent) {
          throw new Error('Parent collection not found');
        }

        parent.children.push(newCollection._id as string);
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

  async findAll({ sortBy = 'position', order = 'asc' }: SortOptions = {}) {
    const sortOrder = order === 'asc' ? 1 : -1;

    const collections = await this.collectionModel
      .find({
        level: 0,
        isArchived: false,
        isDeleted: false,
      })
      .sort({ [sortBy]: sortOrder })
      .exec();
    return collections;
  }

  async findByOwnerId(
    userId: string,
    { sortBy = 'position', order = 'asc' }: SortOptions = {},
  ) {
    const sortOrder = order === 'asc' ? 1 : -1;

    const collection = await this.collectionModel
      .find({
        ownerId: userId,
        level: 0,
        isArchived: false,
        isDeleted: false,
      })
      .sort({ [sortBy]: sortOrder })
      .exec();
    return collection;
  }

  async findArchivedByOwnerId(
    userId: string,
    { sortBy = 'position', order = 'asc' }: SortOptions = {},
  ) {
    const sortOrder = order === 'asc' ? 1 : -1;

    const collection = await this.collectionModel
      .find({
        ownerId: userId,
        level: 0,
        isArchived: true,
        isDeleted: false,
      })
      .sort({ [sortBy]: sortOrder })
      .exec();
    return collection;
  }

  async findById(collectionId: string) {
    const collection = await this.collectionModel.findById(collectionId).exec();
    if (!collection) {
      throw new NotFoundException(
        `Collection with ID ${collectionId} not found`,
      );
    }
    return collection;
  }

  async updateById(collectionId: string, updateData: UpdateCollectionDto) {
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
