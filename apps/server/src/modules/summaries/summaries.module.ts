import { Module } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { SummariesController } from './summaries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SummarySchema } from './schema/summary.schema';
import { NoteSchema } from '../notes/schema/note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Summary',
        schema: SummarySchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'Note',
        schema: NoteSchema,
      },
    ]),
  ],
  controllers: [SummariesController],
  providers: [SummariesService],
  exports: [SummariesService],
})
export class SummariesModule {}
