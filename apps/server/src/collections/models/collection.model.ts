import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CollectionDocument = Collection & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Collection {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Collection' }],
    default: null,
  })
  parentId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    default: 'Description',
  })
  description?: string;

  @Prop({
    type: [
      {
        _id: { type: MongooseSchema.Types.ObjectId, required: true },
        type: { type: String, required: true, enum: ['Collection', 'Note'] },
      },
    ],
    default: [],
  })
  children: string[];

  @Prop({ default: 0 })
  level: number;

  @Prop({ default: 0 })
  position: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

CollectionSchema.index({ ownerId: 1 });
CollectionSchema.index({ parentId: 1 });
CollectionSchema.index({ ownerId: 1, level: 1 });
CollectionSchema.index({ ownerId: 1, isArchived: 1, isDeleted: 1 });

// Populate children
CollectionSchema.pre('find', function () {
  this.populate('children');
});

CollectionSchema.pre('findOne', function () {
  this.populate('children');
});

CollectionSchema.pre('save', async function (next) {
  if (this.isModified('isArchived') && this.isArchived) {
    await archiveChildren(this);
  }

  if (this.isModified('isArchived') && !this.isArchived) {
    await restoreChildren(this);
  }

  if (this.isModified('isDeleted') && this.isArchived && this.isDeleted) {
    await deleteChildren(this);
  }
  next();
});

async function archiveChildren(collection: any) {
  const children = await collection
    .model('Collection')
    .find({ parentId: collection._id });
  for (const child of children) {
    child.isArchived = true;
    await child.save();
  }
}

async function restoreChildren(collection: any) {
  const children = await collection
    .model('Collection')
    .find({ parentId: collection._id });
  for (const child of children) {
    child.isArchived = false;
    await child.save();
  }
}

async function deleteChildren(collection: any) {
  const children = await collection
    .model('Collection')
    .find({ parentId: collection._id });
  for (const child of children) {
    child.isDeleted = true;
    await child.save();
  }
}
