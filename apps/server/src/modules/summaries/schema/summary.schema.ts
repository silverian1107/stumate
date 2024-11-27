import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import archivePlugin from 'src/core/archive.plugin';

export type SummaryDocument = HydratedDocument<Summary>;

@Schema({ timestamps: true })
export class Summary {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true })
  noteId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: false })
  isCloned: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  sharedWithUsers: mongoose.Schema.Types.ObjectId[];

  @Prop()
  content: string;

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

export const SummarySchema = SchemaFactory.createForClass(Summary);

SummarySchema.plugin(archivePlugin);
