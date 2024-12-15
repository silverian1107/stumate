import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Role } from '../users/schema/user.schema';

@Controller('notes/:noteId/summaries')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Post()
  @Roles(Role.USER)
  @ResponseMessage('Create a new summary for a note')
  async create(
    @Param('noteId') noteId: string,
    @Body() createSummaryDto: CreateSummaryDto,
    @User() user: IUser,
  ) {
    const newSummary = await this.summariesService.create(
      noteId,
      createSummaryDto,
      user,
    );
    return {
      _id: newSummary?._id,
      createdAt: newSummary?.createdAt,
    };
  }

  @Post('/ai')
  @Roles(Role.USER)
  @ResponseMessage('Create a new summary for a note by AI')
  async summarizeByAI(@Param('noteId') noteId: string, @User() user: IUser) {
    return await this.summariesService.handleSummarizeByAI(noteId, user);
  }

  @Get()
  @ResponseMessage('Get summary by noteId')
  async findByNoteId(@Param('noteId') noteId: string, @User() user: IUser) {
    return await this.summariesService.findByNoteId(noteId, user);
  }

  @Patch(':id')
  @Roles(Role.USER)
  @ResponseMessage('Update a summary')
  async update(
    @Param('id') id: string,
    @Body() updateSummaryDto: UpdateSummaryDto,
    @User() user: IUser,
  ) {
    return await this.summariesService.update(id, updateSummaryDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a summary')
  remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    return this.summariesService.remove(id, user);
  }
}
