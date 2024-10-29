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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SortOptions } from 'src/utils/dtos/options.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './models/note.models';
import { NotesService } from './notes.service';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateNoteDto })
  async create(@Body() noteData: CreateNoteDto) {
    return this.notesService.create(noteData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiResponse({ status: 200, description: 'Return all notes.' })
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
  @ApiOperation({ summary: 'Get notes by owner ID' })
  @ApiParam({ name: 'ownerId', required: true })
  @ApiResponse({
    status: 200,
    description: 'Return notes for specified owner.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
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
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'noteId', required: true })
  @ApiResponse({ status: 200, description: 'Return the note.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async findById(@Param('noteId') noteId: string) {
    return this.notesService.findById(noteId);
  }

  @Patch(':noteId')
  @ApiOperation({ summary: 'Update a note by ID' })
  @ApiParam({ name: 'noteId', required: true })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @ApiBody({ type: UpdateNoteDto })
  async updateById(
    @Param('noteId') noteId: string,
    @Body() updateData: UpdateNoteDto,
  ) {
    return this.notesService.updateById(noteId, updateData);
  }

  @Patch(':noteId/archive')
  @ApiOperation({ summary: 'Archive a note by ID' })
  @ApiParam({ name: 'noteId', required: true })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully archived.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async archiveById(@Param('noteId') noteId: string) {
    return this.notesService.archiveById(noteId);
  }

  @Patch(':noteId/restore')
  @ApiOperation({ summary: 'Restore a note by ID' })
  @ApiParam({ name: 'noteId', required: true })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully restored.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async restoreById(@Param('noteId') noteId: string) {
    return this.notesService.restoreById(noteId);
  }

  @Patch(':noteId/delete')
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiParam({ name: 'noteId', required: true })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async deleteById(@Param('noteId') noteId: string) {
    return this.notesService.deleteById(noteId);
  }
}
