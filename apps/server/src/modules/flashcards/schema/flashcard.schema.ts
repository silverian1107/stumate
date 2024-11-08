import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FlashcardDocument = HydratedDocument<Flashcard>;

export enum Rating {
  Manual = 0,
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}

export enum State {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3,
}

@Schema({ timestamps: true })
export class Flashcard {
  @Prop({ required: true })
  front: string;

  @Prop({ require: true })
  back: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Note' })
  noteId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Deck', require: true })
  deckId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: Rating.Manual })
  rating: Rating;

  @Prop({ default: State.New })
  state: State;

  @Prop({ default: 2.5 })
  easiness: number;

  @Prop({ default: 0 })
  interval: number;

  @Prop({ default: 0 })
  repetitions: number;

  @Prop({ default: Date.now() })
  nextReview: number;

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

export const FlashcardSchema = SchemaFactory.createForClass(Flashcard);
