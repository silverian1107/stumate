import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FlashcardDocument = HydratedDocument<Flashcard>;

@Schema({ timestamps: true })
export class Flashcard {
  @Prop({ required: true })
  front: string;

  @Prop({ require: true })
  back: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  noteId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Deck', require: true })
  deckId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Object })
  spacedRepetition: {
    lastReviewed: Date;
    nextReview: Date;
    reviewCount: number;
    easeFactor: number;
    interval: number;
    status: string;
  };

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
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const FlashcardSchema = SchemaFactory.createForClass(Flashcard);
