import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './schema/note.schema';
import { CollectionsModule } from '../collections/collections.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { SummarySchema } from '../summaries/schema/summary.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    MongooseModule.forFeature([{ name: 'Summary', schema: SummarySchema }]),
    CollectionsModule,
    StatisticsModule,
    CaslModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
