import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './models/note.models';
import { SortOptions } from 'src/utils/dtos/options.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Body() noteData: CreateNoteDto) {
    return this.notesService.create(noteData);
  }

  @Get()
  async findAll(): Promise<Note[]> {
    try {
      const notes = await this.notesService.findAll();
      return notes;
    } catch (error) {
      throw new HttpException(
        error.message,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':ownerId/notes')
  async findByOwner(
    @Param('ownerId') ownerId: string,
    @Query() sortOptions: SortOptions,
  ): Promise<Note[]> {
    try {
      const notes = await this.notesService.findByOwnerId(ownerId, sortOptions);
      return notes;
    } catch (error) {
      throw new HttpException(
        error.message,
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':noteId')
  async findById(@Param('noteId') noteId: string) {
    return this.notesService.findById(noteId);
  }
}
