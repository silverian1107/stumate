import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';
import { Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Role } from '../users/schema/user.schema';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateNoteDto })
  async create(@Body() noteData: CreateNoteDto, @User() user: IUser) {
    return this.notesService.create(noteData, user._id);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all notes' })
  @ApiQuery({
    name: 'currentPage',
    description: 'The current page number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'The number of items per page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'qs',
    description: 'Query string for sorting and filtering',
    required: false,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Return all notes.' })
  async findAll(
    @Query('currentPage') currentPage = 1,
    @Query('pageSize') pageSize = 10,
    // @Query() qs: string,
  ) {
    return this.notesService.findAll(
      +currentPage,
      +pageSize,
      // qs
    );
  }

  @Get()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get notes by owner ID' })
  @ApiParam({ name: 'ownerId', required: true })
  @ApiQuery({
    name: 'currentPage',
    description: 'The current page number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'The number of items per page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'qs',
    description: 'Query string for sorting and filtering',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Return notes for specified owner.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findByOwner(
    @Query('currentPage') currentPage = 1,
    @Query('pageSize') pageSize = 10,
    // @Query('qs') qs: string,
    @User() user: IUser,
  ) {
    return this.notesService.findByOwnerId(
      user._id,
      +currentPage,
      +pageSize,
      // qs,
    );
  }

  @Get(':noteId')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'noteId', required: true })
  @ApiResponse({ status: 200, description: 'Return the note.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async findById(@Param('noteId') noteId: string, @User() user: IUser) {
    const foundNote = await this.notesService.findById(noteId);
    if (user.role === 'USER') {
      if (foundNote.ownerId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundNote;
  }

  @Patch(':noteId')
  @Roles(Role.USER)
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
    @User() user: IUser,
  ) {
    const foundNote = await this.notesService.findById(noteId);
    if (foundNote.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return this.notesService.updateById(noteId, updateData);
  }

  @Delete(':noteId')
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiParam({ name: 'noteId', required: true })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async deleteById(@Param('noteId') noteId: string, @User() user: IUser) {
    return await this.notesService.deleteById(noteId, user);
  }
}
