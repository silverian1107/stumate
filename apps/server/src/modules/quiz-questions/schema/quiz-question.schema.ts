import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import archivePlugin from 'src/core/archive.plugin';

export type QuizQuestionDocument = HydratedDocument<QuizQuestion>;

@Schema({ timestamps: true })
export class QuizQuestion {
  @Prop({ required: true })
  question: string;

  @Prop({ default: 'multiple', required: true })
  questionType: string;

  @Prop({
    type: [
      {
        option: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
  })
  answerOptions: {
    option: string;
    isCorrect: boolean;
  }[];

  @Prop()
  answerText: string;

  @Prop({ default: 1, required: true })
  point: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizTest',
    require: true,
  })
  quizTestId: mongoose.Schema.Types.ObjectId;

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

export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);
QuizQuestionSchema.index({ userId: 1 });
QuizQuestionSchema.index({ quizTestId: 1 });
QuizQuestionSchema.index({ questionType: 1 });
QuizQuestionSchema.index({ createdAt: -1 });

QuizQuestionSchema.plugin(archivePlugin);
