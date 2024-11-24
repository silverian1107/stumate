import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('decks/:deckId/flashcards')
@ApiTags('flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
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

  @Get('all')
  @ApiOperation({ summary: 'Get all flashcards by deckId' })
  @ResponseMessage('Get all flashcards by user and deck')
  async getAllFlashcards(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleGetAllFlashcards(deckId, user);
  }

  @Post('bulk/update')
  @ApiOperation({ summary: 'Update multiple flashcards by deckId' })
  @ResponseMessage('Create multiple flashcards by deckId')
  async updateMultiple(
    @Param('deckId') deckId: string,
    @Body() updateFlashcardData: UpdateMultipleFlashcardDto[],
  ): Promise<any> {
    const updated = await this.flashcardsService.updateMultiple(
      deckId,
      updateFlashcardData,
    );

    return updated;
  }

  @Post('study')
  @ApiOperation({ summary: 'Study flashcards by deckId' })
  @ResponseMessage('Study flashcards')
  async getStudyDeck(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleStudyFlashcard(deckId, user);
  }

  @Post(':id/mark')
  @ApiOperation({ summary: 'Mark flashcard as correct or incorrect' })
  @ResponseMessage('Mark a flashcard')
  async markFlashcard(
    @Param('deckId') deckId: string,
    @Param('id') id: string,
    @Body() markFlashcardDTO: MarkFlashcardDTO,
    @User() user: IUser,
  ) {
    return await this.flashcardsService.handleMarkFlashcard(
      deckId,
      id,
      markFlashcardDTO,
      user,
    );
  }

  @Post('progress')
  @ApiOperation({ summary: 'Get progress of flashcards by deckId' })
  @ResponseMessage('Get deck progress')
  async getDeckProgress(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleDeckProgress(deckId, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flashcards by deckId' })
  @ResponseMessage('Fetch list flashcard with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.flashcardsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a flashcard by id' })
  @ResponseMessage('Fetch flashcard by id')
  async findOne(@Param('deckId') deckId: string, @Param('id') id: string) {
    const foundFlashcard = await this.flashcardsService.findOne(deckId, id);
    return foundFlashcard;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a flashcard' })
  @ResponseMessage('Update a flashcard')
  async update(
    @Param('deckId') deckId: string,
    @Param('id') id: string,
    @Body() updateFlashcardDto: UpdateFlashcardDto,
    @User() user: IUser,
  ) {
    const updateFlashcard = await this.flashcardsService.update(
      deckId,
      id,
      updateFlashcardDto,
      user,
    );
    return updateFlashcard;
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
  ): Promise<any> {
    return await this.flashcardsService.removeMultiple(deckId, flashcardIds);
  }
}
