import { Module } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { ArchiveController } from './archive.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckSchema } from '../decks/schema/deck.schema';
import { FlashcardSchema } from '../flashcards/schema/flashcard.schema';
import { QuizTestSchema } from '../quiz-tests/schema/quiz-test.schema';
import { QuizQuestionSchema } from '../quiz-questions/schema/quiz-question.schema';
import { QuizAttemptSchema } from '../quiz-attempts/schema/quiz-attempt.schema';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: 'Collection', schema: CollectionSchema },
    // ]),
    // MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Deck', schema: DeckSchema }]),
    MongooseModule.forFeature([{ name: 'Flashcard', schema: FlashcardSchema }]),
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
  ],
  controllers: [ArchiveController],
  providers: [ArchiveService],
})
export class ArchiveModule {}
