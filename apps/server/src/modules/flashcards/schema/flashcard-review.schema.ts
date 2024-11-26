import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import archivePlugin from 'src/core/archive.plugin';

export type FlashcardReviewDocument = HydratedDocument<FlashcardReview>;

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

@Schema()
export class FlashcardReview {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flashcard',
    require: true,
  })
  flashcardId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: Date.now() })
  nextReview: number;

  @Prop({ default: 2.5 })
  easiness: number;

  @Prop({ default: 0 })
  interval: number;

  @Prop({ default: 0 })
  repetitions: number;

  @Prop({ default: Rating.Manual })
  rating: Rating;

  @Prop({ default: State.New })
  state: State;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FlashcardReviewSchema =
  SchemaFactory.createForClass(FlashcardReview);

FlashcardReviewSchema.plugin(archivePlugin);
