import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { QuizTestsModule } from '../quiz-tests/quiz-tests.module';
import { DecksModule } from '../decks/decks.module';
import { TagsModule } from '../tags/tags.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UserStatisticSchema } from '../statistics/schema/user-statistic.schema';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'UserStatistic', schema: UserStatisticSchema },
    ]),
    QuizTestsModule,
    DecksModule,
    TagsModule,
    NotificationsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
