import { Module } from '@nestjs/common';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeckSchema } from './schema/deck.schema';
import { FlashcardSchema } from '../flashcards/schema/flashcard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Deck', schema: DeckSchema }]),
    MongooseModule.forFeature([{ name: 'Flashcard', schema: FlashcardSchema }]),
  ],
  controllers: [DecksController],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
