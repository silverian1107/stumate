import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserStatisticDocument = HydratedDocument<UserStatistic>;

@Schema({ timestamps: true })
export class UserStatistic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  date: Date;

  @Prop()
  studyTime: number;

  @Prop({ required: true })
  UserStatisticname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  gender: string;

  @Prop()
  avatarUrl: string;

  @Prop({ type: Object, default: {} })
  settings: {
    theme?: string;
    language?: string;
    fontSize?: string;
  };

  @Prop()
  refreshToken: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  codeId: string;

  @Prop()
  codeExpire: Date;

  @Prop({ default: 'UserStatistic' })
  role: string;

  @Prop({ default: 'LOCAL' })
  accountType: string;

  @Prop()
  lastLogin: Date;
}

export const UserStatisticSchema = SchemaFactory.createForClass(UserStatistic);
