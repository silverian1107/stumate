import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DeckDocument = HydratedDocument<Deck>;

@Schema({ timestamps: true })
export class Deck {
  @Prop({ default: 'Unnamed' })
  name: string;

  @Prop({ default: 'Description' })
  description: string;

  @Prop()
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  parentId: mongoose.Schema.Types.ObjectId;

  @Prop()
  children: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  }[];

  @Prop({ default: false })
  isPublish: boolean;

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

export const DeckSchema = SchemaFactory.createForClass(Deck);
