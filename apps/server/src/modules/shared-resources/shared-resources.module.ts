import { Module } from '@nestjs/common';
import { SharedResourcesService } from './shared-resources.service';
import { SharedResourcesController } from './shared-resources.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from '../notes/schema/note.schema';
import { DeckSchema } from '../decks/schema/deck.schema';
import { QuizTestSchema } from '../quiz-tests/schema/quiz-test.schema';
import { UserSchema } from '../users/schema/user.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { SummarySchema } from '../summaries/schema/summary.schema';
import { FlashcardSchema } from '../flashcards/schema/flashcard.schema';
import { QuizQuestionSchema } from '../quiz-questions/schema/quiz-question.schema';
import { CaslModule } from 'src/casl/casl.module';
import { FlashcardReviewSchema } from '../flashcards/schema/flashcard-review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
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
    NotificationsModule,
    CaslModule,
  ],
  controllers: [SharedResourcesController],
  providers: [SharedResourcesService],
})
export class SharedResourcesModule {}
