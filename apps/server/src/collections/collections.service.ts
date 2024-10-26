import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionDocument } from './models/collection.model';
import { SortOptions } from './interfaces/options.interface';

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

    const rootCollections = await this.collectionModel
      .find({ level: 0 })
      .sort({ [sortBy]: sortOrder })
      .exec();
    return rootCollections;
  }
}
