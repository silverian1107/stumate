import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import archivePlugin from 'src/core/archive.plugin';

export type QuizAttemptDocument = HydratedDocument<QuizAttempt>;

@Schema({ timestamps: true })
export class QuizAttempt {
  @Prop({ default: 0 })
  score: number;

  @Prop({ required: true })
  totalQuestions: number;

  @Prop({ default: 0 })
  correctAnswers: number;

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
    default: [],
  })
  answers: {
    quizQuestionId: mongoose.Schema.Types.ObjectId;
    answer: string[];
    isCorrect: boolean;
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

export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);

QuizAttemptSchema.plugin(archivePlugin);
