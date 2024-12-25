import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import archivePlugin from 'src/core/archive.plugin';

export type DeckDocument = HydratedDocument<Deck>;

@Schema({ timestamps: true })
export class Deck {
  @Prop({ require: true })
  name: string;

  @Prop({ default: 'Description' })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  ownerId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Note', require: false })
  noteId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: Object,
    default: {
      totalCards: 0,
      reviewedCards: 0,
      dueToday: 0,
      progress: 0,
    },
  })
  studyStatus: {
    totalCards: number;
    reviewedCards: number;
    lastStudied: Date;
    dueToday: number;
    progress: number;
  };

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
  tags: mongoose.Schema.Types.ObjectId[];

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

export const DeckSchema = SchemaFactory.createForClass(Deck);

DeckSchema.plugin(archivePlugin);
