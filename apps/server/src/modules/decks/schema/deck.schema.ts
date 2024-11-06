import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DeckDocument = HydratedDocument<Deck>;

@Schema({ timestamps: true })
export class Deck {
  @Prop({ require: true })
  name: string;

  @Prop({ default: 'Description' })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  tag: string[];

  @Prop({ type: Object })
  studyStatus: {
    lastStudied: Date;
    dueToday: number;
    progress: number;
  };

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    username: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    username: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    username: string;
  };
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
