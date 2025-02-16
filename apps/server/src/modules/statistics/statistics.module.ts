import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schema/user.schema';
import { UserStatisticSchema } from './schema/user-statistic.schema';
import { FlashcardSchema } from '../flashcards/schema/flashcard.schema';
import { NoteSchema } from '../notes/schema/note.schema';
import { QuizTestSchema } from '../quiz-tests/schema/quiz-test.schema';
import { QuizAttemptSchema } from '../quiz-attempts/schema/quiz-attempt.schema';
import { GatewayModule } from 'src/gateway/gateway.module';
import { FlashcardReviewSchema } from '../flashcards/schema/flashcard-review.schema';
import { DeckSchema } from '../decks/schema/deck.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserStatistic', schema: UserStatisticSchema },
    ]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Deck', schema: DeckSchema }]),
    MongooseModule.forFeature([{ name: 'Flashcard', schema: FlashcardSchema }]),
    MongooseModule.forFeature([
      { name: 'FlashcardReview', schema: FlashcardReviewSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    MongooseModule.forFeature([
      {
        name: 'QuizTest',
        schema: QuizTestSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'QuizAttempt',
        schema: QuizAttemptSchema,
      },
    ]),
    GatewayModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
