import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CustomAttemptDocument = HydratedDocument<CustomAttempt>;

@Schema({ timestamps: true })
export class CustomAttempt {
  @Prop({ required: true, type: [Types.ObjectId], ref: 'QuizTest' })
  selectedQuizzes: Types.ObjectId[];

  @Prop({ required: true })
  duration: number;

  @Prop({
    type: [
      {
        quizQuestionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'QuizQuestion',
          require: true,
        },
        answer: { type: [String], default: [] },
        isCorrect: { type: Boolean, default: false },
      },
    ],
    default: [],
  })
  answers: {
    quizQuestionId: mongoose.Schema.Types.ObjectId;
    answer: string[];
    isCorrect: boolean;
  }[];

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    require: true,
  })
  userId: Types.ObjectId;

  @Prop({ required: true, default: 'NOT_STARTED' })
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'REVIEWING' | 'COMPLETED';

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: Types.ObjectId;
    username: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: Types.ObjectId;
    username: string;
  };
}

export const CustomAttemptSchema = SchemaFactory.createForClass(CustomAttempt);
