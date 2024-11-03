import { Module } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsController } from './flashcards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Flashcard, FlashcardSchema } from './schema/flashcard.schema';
import { Deck, DeckSchema } from '../decks/schema/deck.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flashcard.name, schema: FlashcardSchema },
    ]),
    MongooseModule.forFeature([{ name: Deck.name, schema: DeckSchema }]),
  ],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
  exports: [FlashcardsService],
})
export class FlashcardsModule {}
