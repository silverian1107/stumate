import { Module } from '@nestjs/common';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckSchema } from './schema/deck.schema';
import { FlashcardSchema } from '../flashcards/schema/flashcard.schema';
import { CaslModule } from 'src/casl/casl.module';
import { FlashcardReviewSchema } from '../flashcards/schema/flashcard-review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Deck', schema: DeckSchema }]),
    MongooseModule.forFeature([{ name: 'Flashcard', schema: FlashcardSchema }]),
    MongooseModule.forFeature([
      { name: 'FlashcardReview', schema: FlashcardReviewSchema },
    ]),
    CaslModule,
  ],
  controllers: [DecksController],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
