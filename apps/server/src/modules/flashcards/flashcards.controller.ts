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

@Controller('decks/:deckId/flashcards')
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
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
  @ResponseMessage('Get all flashcards by user and deck')
  async getAllFlashcards(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleGetAllFlashcards(deckId, user);
  }

  @Post('bulk/update')
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
  @ResponseMessage('Study flashcards')
  async getStudyDeck(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleStudyFlashcard(deckId, user);
  }

  @Post(':id/mark')
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
  @ResponseMessage('Get deck progress')
  async getDeckProgress(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleDeckProgress(deckId, user);
  }

  @Get()
  @ResponseMessage('Fetch list flashcard with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.flashcardsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch flashcard by id')
  async findOne(@Param('deckId') deckId: string, @Param('id') id: string) {
    const foundFlashcard = await this.flashcardsService.findOne(deckId, id);
    return foundFlashcard;
  }

  @Patch(':id')
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
  @ResponseMessage('Delete a flashcard')
  remove(
    @Param('deckId') deckId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<any> {
    return this.flashcardsService.remove(deckId, id, user);
  }
}
