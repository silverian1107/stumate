import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

export type CollectionDocument = Collection & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Collection {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Collection' })
  parentId: string;

  @Prop({ type: String, default: 'Collection' })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    default: 'Description',
  })
  description: string;

  @Prop([
    {
      _id: { type: MongooseSchema.Types.ObjectId, refPath: 'children.type' },
      type: { type: String, enum: ['Collection', 'Note'] },
    },
  ])
  children: Array<{
    _id: string;
    type: 'Collection' | 'Note';
  }>;

  @Prop({ default: 0 })
  level: number;

  @Prop({ default: 0 })
  position: number;

  // @Prop({ default: false })
  // isPublished: boolean;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop()
  deletedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
  tags: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  sharedWithUsers: mongoose.Schema.Types.ObjectId[];
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

CollectionSchema.index({ ownerId: 1 });
CollectionSchema.index({ parentId: 1 });
CollectionSchema.index({ ownerId: 1, level: 1 });
CollectionSchema.index({ ownerId: 1, isArchived: 1, isDeleted: 1 });

// Populate children
CollectionSchema.virtual('childrenDocs', {
  refPath: 'children.type',
  localField: 'children._id',
  foreignField: '_id',
  justOne: false,
});

CollectionSchema.set('toObject', { virtuals: true });
CollectionSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.id;
  },
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
    child.deletedAt = new Date();
    await child.save();
  }
}
