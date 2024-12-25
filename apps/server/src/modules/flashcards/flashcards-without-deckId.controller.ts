import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { Role } from '../users/schema/user.schema';
import { IUser } from '../users/users.interface';

@Controller('flashcards')
@ApiTags('flashcards')
export class FlashcardsWithhoutDeckIdController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all flashcards by deckId' })
  @ResponseMessage('Fetch list flashcard with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.flashcardsService.findAll(+currentPage, +pageSize, qs);
  }

  @Patch('archive/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Archive a flashcard' })
  @ResponseMessage('Archive a flashcard')
  async archive(@Param('id') id: string) {
    return this.flashcardsService.archive(id);
  }

  @Patch('restore/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Restore a flashcard' })
  @ResponseMessage('Restore a flashcard')
  async restore(@Param('id') id: string) {
    return this.flashcardsService.restore(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a flashcard' })
  @ResponseMessage('Delete a flashcard')
  async delete(@Param('id') id: string, @User() user: IUser) {
    return this.flashcardsService.delete(id, user);
  }

  @Get('archived')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all flashcards by deckId' })
  @ResponseMessage('Fetch list flashcard with pagination')
  findAllArchived(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.flashcardsService.findAllArchived(+currentPage, +pageSize, qs);
  }
}
