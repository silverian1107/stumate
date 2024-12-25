import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Note, NoteSchema } from '../notes/schema/note.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QuizTest,
  QuizTestSchema,
} from '../quiz-tests/schema/quiz-test.schema';
import { Deck, DeckSchema } from '../decks/schema/deck.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Note.name,
        schema: NoteSchema,
      },
      {
        name: Deck.name,
        schema: DeckSchema,
      },
      {
        name: QuizTest.name,
        schema: QuizTestSchema,
      },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
