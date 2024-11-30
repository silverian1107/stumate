import { forwardRef, Module } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { FlashcardsController } from './flashcards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Flashcard, FlashcardSchema } from './schema/flashcard.schema';
import { DecksModule } from '../decks/decks.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { NotificationsModule } from '../notifications/notifications.module';
import {
  FlashcardReview,
  FlashcardReviewSchema,
} from './schema/flashcard-review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Flashcard.name, schema: FlashcardSchema },
    ]),
    MongooseModule.forFeature([
      { name: FlashcardReview.name, schema: FlashcardReviewSchema },
    ]),
    forwardRef(() => DecksModule),
    GatewayModule,
    StatisticsModule,
    NotificationsModule,
  ],
  controllers: [FlashcardsController],
  providers: [FlashcardsService],
  exports: [FlashcardsService],
})
export class FlashcardsModule {}
