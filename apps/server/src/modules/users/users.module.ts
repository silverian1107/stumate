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
import { CollectionsModule } from '../collections/collections.module';
import { CaslModule } from 'src/casl/casl.module';
import { QuizAttemptSchema } from '../quiz-attempts/schema/quiz-attempt.schema';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'UserStatistic', schema: UserStatisticSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'QuizAttempt', schema: QuizAttemptSchema },
    ]),
    QuizTestsModule,
    DecksModule,
    TagsModule,
    NotificationsModule,
    CollectionsModule,
    CaslModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
