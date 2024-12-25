import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserStatisticDocument = HydratedDocument<UserStatistic>;

@Schema({ timestamps: true })
export class UserStatistic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  date: Date;

  @Prop({ default: 0 })
  dailyStudyDuration: number;

  @Prop({ default: 0 })
  studyStreakDays: number;

  @Prop({ default: 0 })
  totalNotesCount: number;

  @Prop({ default: 0 })
  totalFlashcardsCount: number;

  @Prop({ default: 0 })
  sharedResourcesCount: number;

  @Prop({ default: 0 })
  flashcardsDueTodayCount: number;

  @Prop({ default: 0 })
  totalQuizzesCount: number;

  @Prop({ default: 0 })
  quizzesCompletedToday: number;

  @Prop({ default: 0 })
  flashcardsCompletedToday: number;

  @Prop({ default: 0 })
  flashcardMasteryProgressToday: number;

  @Prop({ default: 0 })
  accuracyRate: number;

  @Prop({ default: 0 })
  accuracyRateToday: number;

  @Prop({ default: 0 })
  lowAccuracyCount: number;

  @Prop({ default: 0 })
  studiedFlashcardsCount: number;

  @Prop({ default: [] })
  dailyTaskList: string[];

  @Prop({ default: 0 })
  completedTasksCount: number;

  @Prop({ default: 0 })
  sessionsThisWeek: number;

  @Prop({ default: [] })
  monthlyStudyHeatmap: string[];
}

export const UserStatisticSchema = SchemaFactory.createForClass(UserStatistic);
UserStatisticSchema.index({ userId: 1 });
UserStatisticSchema.index({ date: 1 });
UserStatisticSchema.index({ userId: 1, date: 1 });
