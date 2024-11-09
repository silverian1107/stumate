import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuizQuestionDocument = HydratedDocument<QuizQuestion>;

@Schema({ timestamps: true })
export class QuizQuestion {
  @Prop({ required: true })
  question: string;

  @Prop({ default: 'MULTIPLE_CHOICE', required: true })
  questionType: string;

  @Prop({
    type: [
      {
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
    ref: 'QuizTest',
    require: true,
  })
  quizTestId: mongoose.Schema.Types.ObjectId;

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
