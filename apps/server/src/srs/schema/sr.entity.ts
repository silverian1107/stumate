export class Sr {}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SrsDocument = HydratedDocument<Srs>;

@Schema({ timestamps: true })
export class Srs {
  @Prop({ required: true })
  front: string;

  @Prop({ require: true })
  back: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  // @Prop({ type: Object })
  // createdBy: {
  //   _id: mongoose.Schema.Types.ObjectId;
  //   username: string;
  // };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    username: string;
  };

  @Prop({
    type: Object,
  })
  repetitionData: {
    lapses: number;
    state: 'New' | 'Learning' | 'Review' | 'Relearning';
    last_review?: Date;
    due?: Date;
    stability?: number;
    difficulty?: number;
    elapsed_days?: number;
    scheduled_days?: number;
  };
}

export const SrsSchema = SchemaFactory.createForClass(Srs);
