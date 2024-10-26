import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionDocument } from './models/collection.model';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: Model<CollectionDocument>,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}

  async create(
    newCollectionData: CreateCollectionDto,
  ): Promise<CollectionDocument> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    try {
      const newCollection = new this.collectionModel(newCollectionData);

      if (newCollection.parentId) {
        const parent = await this.collectionModel
          .findById(newCollection.parentId)
          .session(transactionSession);

        if (!parent) {
          throw new Error('Parent collection not found');
        }

        parent.children.push(newCollection._id as string);
        // Tính level và position
        newCollection.position = parent.children.length;
        newCollection.level = parent.level + 1;

        await parent.save({ session: transactionSession });
      }

      await newCollection.save({ session: transactionSession });
      await transactionSession.commitTransaction();

      return newCollection;
    } catch (error) {
      await transactionSession.abortTransaction();
      throw new Error(`Failed to create collection: ${error.message}`);
    } finally {
      transactionSession.endSession();
    }
  }

  async findAll() {
    return this.collectionModel.find();
  }
}
