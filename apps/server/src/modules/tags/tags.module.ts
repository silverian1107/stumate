import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagSchema } from './schema/tag.schema';
import { NoteSchema } from '../notes/schema/note.schema';
import { DeckSchema } from '../decks/schema/deck.schema';
import { QuizTestSchema } from '../quiz-tests/schema/quiz-test.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema } from '../collections/schema/collection.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Tag', schema: TagSchema }]),
    MongooseModule.forFeature([
      { name: 'Collection', schema: CollectionSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Deck', schema: DeckSchema }]),
    MongooseModule.forFeature([
      {
        name: 'QuizTest',
        schema: QuizTestSchema,
      },
    ]),
    CaslModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
