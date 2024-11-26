import { Module } from '@nestjs/common';
import { SharedResourcesService } from './shared-resources.service';
import { SharedResourcesController } from './shared-resources.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema } from '../collections/schema/collection.schema';
import { NoteSchema } from '../notes/schema/note.schema';
import { DeckSchema } from '../decks/schema/deck.schema';
import { QuizTestSchema } from '../quiz-tests/schema/quiz-test.schema';
import { UserSchema } from '../users/schema/user.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
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
    NotificationsModule,
  ],
  controllers: [SharedResourcesController],
  providers: [SharedResourcesService],
})
export class SharedResourcesModule {}
