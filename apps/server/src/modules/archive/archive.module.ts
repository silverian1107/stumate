import { Module } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { ArchiveController } from './archive.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckSchema } from '../decks/schema/deck.schema';
import { FlashcardSchema } from '../flashcards/schema/flashcard.schema';
import { QuizTestSchema } from '../quiz-tests/schema/quiz-test.schema';
import { QuizQuestionSchema } from '../quiz-questions/schema/quiz-question.schema';
import { QuizAttemptSchema } from '../quiz-attempts/schema/quiz-attempt.schema';
import { CollectionSchema } from '../collections/schema/collection.schema';
import { NoteSchema } from '../notes/schema/note.schema';
import { SummarySchema } from '../summaries/schema/summary.schema';
import { FlashcardReviewSchema } from '../flashcards/schema/flashcard-review.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
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
      {
        name: 'QuizAttempt',
        schema: QuizAttemptSchema,
      },
    ]),
    CaslModule,
  ],
  controllers: [ArchiveController],
  providers: [ArchiveService],
})
export class ArchiveModule {}
