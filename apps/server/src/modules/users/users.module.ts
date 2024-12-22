import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserStatisticSchema } from '../statistics/schema/user-statistic.schema';
import { QuizAttemptSchema } from '../quiz-attempts/schema/quiz-attempt.schema';
import { CollectionSchema } from '../collections/schema/collection.schema';
import { NoteSchema } from '../notes/schema/note.schema';
import { SummarySchema } from '../summaries/schema/summary.schema';
import { DeckSchema } from '../decks/schema/deck.schema';
import { FlashcardSchema } from '../flashcards/schema/flashcard.schema';
import { FlashcardReviewSchema } from '../flashcards/schema/flashcard-review.schema';
import { QuizTestSchema } from '../quiz-tests/schema/quiz-test.schema';
import { QuizQuestionSchema } from '../quiz-questions/schema/quiz-question.schema';
import { NotificationSchema } from '../notifications/schema/notification.schema';
import { TagSchema } from '../tags/schema/tag.schema';
import { TodoSchema } from '../todo/schema/todo.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
    MongooseModule.forFeature([
      { name: 'Collection', schema: CollectionSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Summary', schema: SummarySchema }]),
    MongooseModule.forFeature([{ name: 'Deck', schema: DeckSchema }]),
    MongooseModule.forFeature([{ name: 'Flashcard', schema: FlashcardSchema }]),
    MongooseModule.forFeature([
      { name: 'FlashcardReview', schema: FlashcardReviewSchema },
    ]),
    MongooseModule.forFeature([
      {
        name: 'QuizTest',
        schema: QuizTestSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'QuizQuestion',
        schema: QuizQuestionSchema,
      },
    ]),
    MongooseModule.forFeature([
      { name: 'QuizAttempt', schema: QuizAttemptSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }]),
    MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }]),
    MongooseModule.forFeature([
      { name: 'UserStatistic', schema: UserStatisticSchema },
    ]),
    StatisticsModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
