import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './schema/note.schema';
import { CollectionsModule } from '../collections/collections.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Note', schema: NoteSchema }]),
    CollectionsModule,
    StatisticsModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
