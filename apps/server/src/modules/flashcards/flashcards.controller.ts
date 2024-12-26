import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { FlashcardsService } from './flashcards.service';
import {
  CreateFlashcardDto,
  MarkFlashcardDTO,
} from './dto/create-flashcard.dto';
import {
  UpdateFlashcardDto,
  UpdateMultipleFlashcardDto,
} from './dto/update-flashcard.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Role } from '../users/schema/user.schema';

@Controller('decks/:deckId/flashcards')
@ApiTags('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new flashcard by deckId' })
  @ResponseMessage('Create a new flashcard by deckId')
  async create(
    @Param('deckId') deckId: string,
    @Body() createFlashcardDto: CreateFlashcardDto,
    @User() user: IUser,
  ) {
    const newFlashcard = await this.flashcardsService.create(
      deckId,
      createFlashcardDto,
      user,
    );

    return {
      _id: newFlashcard?._id,
      createdAt: newFlashcard?.createdAt,
    };
  }

  @Post('bulk/create')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create multiple flashcards by deckId' })
  @ResponseMessage('Create multiple flashcards by deckId')
  async createMultiple(
    @Param('deckId') deckId: string,
    @Body() createFlashcardData: CreateFlashcardDto[],
    @User() user: IUser,
  ) {
    const newFlashcards = await this.flashcardsService.createMultiple(
      deckId,
      createFlashcardData,
      user,
    );
    return newFlashcards.map((flashcard: any) => ({
      _id: flashcard._id,
      createdAt: flashcard.createdAt,
    }));
  }

  @Post(':noteId/bulk/ai')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create multiple flashcards by deckId' })
  @ResponseMessage('Create multiple flashcards by ai')
  async createMultipleByAI(
    @Param('deckId') deckId: string,
    @Param('noteId') noteId: string,
    @User() user: IUser,
  ) {
    return await this.flashcardsService.handleCreateMultipleByAI(
      deckId,
      noteId,
      user,
    );
  }

  @Get('all')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get all flashcards by deckId' })
  @ResponseMessage('Get all flashcards by user and deck')
  async getAllFlashcards(
    @Param('deckId') deckId: string,
    @User() user: IUser,
    @Query() qs: string,
  ) {
    return await this.flashcardsService.findByDeckAndUser(deckId, user, qs);
  }

  @Post('bulk/update')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Update multiple flashcards by deckId' })
  @ResponseMessage('Create multiple flashcards by deckId')
  async updateMultiple(
    @Param('deckId') deckId: string,
    @Body() updateFlashcardData: UpdateMultipleFlashcardDto[],
    @User() user: IUser,
  ): Promise<any> {
    const updated = await this.flashcardsService.updateMultiple(
      deckId,
      updateFlashcardData,
      user,
    );

    return updated;
  }

  @Get('study')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Study flashcards by deckId' })
  @ResponseMessage('Study flashcards')
  async getStudyDeck(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleStudyFlashcard(deckId, user);
  }

  @Post(':id/mark')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Mark flashcard as correct or incorrect' })
  @ResponseMessage('Mark a flashcard')
  async markFlashcard(
    @Param('id') id: string,
    @Body() markFlashcardDTO: MarkFlashcardDTO,
    @User() user: IUser,
  ) {
    return await this.flashcardsService.handleMarkFlashcard(
      id,
      markFlashcardDTO,
      user,
    );
  }

  @Post('progress')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get progress of flashcards by deckId' })
  @ResponseMessage('Get deck progress')
  async getDeckProgress(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleDeckProgress(deckId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a flashcard by id' })
  @ResponseMessage('Fetch flashcard by id')
  async findOne(
    @Param('deckId') deckId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    const foundFlashcard = await this.flashcardsService.findOne(deckId, id);
    if (user.role === 'USER') {
      if (foundFlashcard.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundFlashcard;
  }

  @Get(':id/review')
  @ResponseMessage('Fetch flashcard review by id')
  async findFlashcardReview(
    @Param('flashcardId') flashcardId: string,
    @User() user: IUser,
  ) {
    const foundFlashcardReview =
      await this.flashcardsService.findFlashcardReview(flashcardId);
    if (user.role === 'USER') {
      if (foundFlashcardReview.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundFlashcardReview;
  }

  @Patch(':id')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Update a flashcard' })
  @ResponseMessage('Update a flashcard')
  async update(
    @Param('deckId') deckId: string,
    @Param('id') id: string,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
    @User() user: IUser,
  ) {
    const foundFlashcard = await this.flashcardsService.findOne(deckId, id);
    if (foundFlashcard.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return await this.flashcardsService.update(
      deckId,
      id,
      updateFlashcardDto,
      user,
    );
  }

  @Delete('all')
  @ResponseMessage('Delete a flashcard')
  removeAll(
    @Param('deckId') deckId: string,
    @User() user: IUser,
  ): Promise<any> {
    return this.flashcardsService.removeAll(deckId, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a flashcard' })
  @ResponseMessage('Delete a flashcard')
  remove(
    @Param('deckId') deckId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<any> {
    return this.flashcardsService.remove(deckId, id, user);
  }

  @Delete('bulk/delete')
  @ApiOperation({ summary: 'Delete multiple flashcards' })
  @ResponseMessage('Delete multiple flashcards')
  async removeMultiple(
    @Param('deckId') deckId: string,
    @Body() flashcardIds: string[],
    @User() user: IUser,
  ): Promise<any> {
    return await this.flashcardsService.removeMultiple(
      deckId,
      flashcardIds,
      user,
    );
  }
}
