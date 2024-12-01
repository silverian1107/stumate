import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
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
import { CheckPolicies, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Flashcard } from './schema/flashcard.schema';
import { Deck } from '../decks/schema/deck.schema';
import { FlashcardReview } from './schema/flashcard-review.schema';
import { AbilityGuard } from 'src/casl/ability.guard';

@Controller('decks/:deckId/flashcards')
@ApiTags('flashcards')
@UseGuards(AbilityGuard)
export class FlashcardsController {
  constructor(private readonly flashcardsService: FlashcardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new flashcard by deckId' })
  @ResponseMessage('Create a new flashcard by deckId')
  @CheckPolicies((ability) => ability.can(Action.CREATE, Flashcard))
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
  @CheckPolicies((ability) => ability.can(Action.CREATE, Flashcard))
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
  @CheckPolicies((ability) => ability.can(Action.READ, Flashcard))
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
  @CheckPolicies((ability) => ability.can(Action.STUDY, Deck))
  @ResponseMessage('Study flashcards')
  async getStudyDeck(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleStudyFlashcard(deckId, user);
  }

  @Post(':id/mark')
  @ApiOperation({ summary: 'Mark flashcard as correct or incorrect' })
  @CheckPolicies((ability) => ability.can(Action.UPDATE, FlashcardReview))
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
  @ApiOperation({ summary: 'Get progress of flashcards by deckId' })
  @CheckPolicies((ability) => ability.can(Action.READ, Deck))
  @ResponseMessage('Get deck progress')
  async getDeckProgress(@Param('deckId') deckId: string, @User() user: IUser) {
    return await this.flashcardsService.handleDeckProgress(deckId, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flashcards by deckId' })
  @CheckPolicies((ability) => ability.can(Action.READ, Flashcard))
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
  @CheckPolicies((ability) => ability.can(Action.READ, Flashcard))
  @ResponseMessage('Fetch flashcard by id')
  async findOne(@Param('deckId') deckId: string, @Param('id') id: string) {
    const foundFlashcard = await this.flashcardsService.findOne(deckId, id);
    return foundFlashcard;
  }

  @Get(':id/review')
  @CheckPolicies((ability) => ability.can(Action.READ, FlashcardReview))
  @ResponseMessage('Fetch flashcard review by id')
  async findFlashcardReview(
    @Param('deckId') deckId: string,
    @Param('id') id: string,
  ) {
    const foundFlashcardReview =
      await this.flashcardsService.findFlashcardReview(deckId, id);
    return foundFlashcardReview;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a flashcard' })
  @CheckPolicies((ability) => ability.can(Action.UPDATE, Flashcard))
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
  @CheckPolicies((ability) => ability.can(Action.DELETE, Flashcard))
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
