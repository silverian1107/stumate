import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller('notes/:noteId/summaries')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Post()
  @ResponseMessage('Create a new summary for a note')
  async create(
    @Param() noteId: string,
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

  @Get()
  @ResponseMessage('Get summary by noteId')
  async findByNoteId(@Param() noteId: string) {
    const foundSummary = await this.summariesService.findByNoteId(noteId);
    return foundSummary;
  }

  @Patch(':id')
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
