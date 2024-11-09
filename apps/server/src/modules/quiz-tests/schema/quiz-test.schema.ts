import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuizTestDocument = HydratedDocument<QuizTest>;

enum Status {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PROGRESS_SAVED = 'PROGRESS_SAVED',
  COMPLETED = 'COMPLETED',
  REVIEWED = 'REVIEWED',
}

@Schema({ timestamps: true })
export class QuizTest {
  @Prop({ required: true })
  title: string;

  @Prop({ default: 'Description' })
  description: string;

  @Prop({ min: 0, required: true })
  numberOfQuestion: number;

  @Prop({ min: 0 })
  duration: number;

  @Prop({ enum: Status, default: Status.NOT_STARTED })
  status: string;

  @Prop()
  isPublished: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
  })
  noteId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
  tags: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  sharedWithUsers: mongoose.Schema.Types.ObjectId[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

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
}

export const QuizTestSchema = SchemaFactory.createForClass(QuizTest);
