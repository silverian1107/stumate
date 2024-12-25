import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import archivePlugin from 'src/core/archive.plugin';

export type FlashcardDocument = HydratedDocument<Flashcard>;

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

  @Prop({ default: false })
  isCloned: boolean;

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

export const FlashcardSchema = SchemaFactory.createForClass(Flashcard);
FlashcardSchema.index({ userId: 1 });
FlashcardSchema.index({ noteId: 1 });
FlashcardSchema.index({ deckId: 1 });
FlashcardSchema.index({ userId: 1, deckId: 1 });
FlashcardSchema.index({ sharedWithUsers: 1 });

FlashcardSchema.plugin(archivePlugin);
