import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './models/note.models';
import { SortOptions } from 'src/utils/dtos/options.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

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

  @Patch(':noteId')
  async updateById(
    @Param('noteId') noteId: string,
    @Body() updateData: UpdateNoteDto,
  ) {
    return this.notesService.updateById(noteId, updateData);
  }

  @Patch(':noteId/archive')
  async archiveById(@Param('noteId') noteId: string) {
    return this.notesService.archiveById(noteId);
  }

  @Patch(':noteId/restore')
  async restoreById(@Param('noteId') noteId: string) {
    return this.notesService.restoreById(noteId);
  }

  @Patch(':noteId/delete')
  async deleteById(@Param('noteId') noteId: string) {
    return this.notesService.deleteById(noteId);
  }
}
