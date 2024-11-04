import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuizAttemptDocument = HydratedDocument<QuizAttempt>;

@Schema({ timestamps: true })
export class QuizAttempt {
  @Prop()
  score: number;

  @Prop({ required: true })
  totalQuestions: number;

  @Prop()
  correctAnswers: number;

  @Prop({ default: 'NOT_STARTED' })
  status: string;

  @Prop({
    type: [
      {
        quizQuestionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'QuizQuestion',
          require: true,
        },
      },
    ],
  })
  answers: {
    quizQuestionId: mongoose.Schema.Types.ObjectId;
    answer: string;
  }[];

  @Prop()
  duration: number;

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

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);
