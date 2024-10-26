import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CollectionDocument = Collection & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform(_, ret) {
      delete ret.__v;
      return ret;
    },
  },
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
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Collection' }],
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
  isArchive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);

// Indexes for better query performance
CollectionSchema.index({ ownerId: 1 });
CollectionSchema.index({ parentId: 1 });
CollectionSchema.index({ level: 1 });
CollectionSchema.index({ position: 1 });

CollectionSchema.pre('find', function () {
  this.populate('children');
});

CollectionSchema.pre('findOne', function () {
  this.populate('children');
});
