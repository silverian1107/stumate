import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionSchema } from './schema/collection.schema';
import { NoteSchema } from '../notes/schema/note.schema';
import { SummarySchema } from '../summaries/schema/summary.schema';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Collection', schema: CollectionSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Summary', schema: SummarySchema }]),
    StatisticsModule,
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
