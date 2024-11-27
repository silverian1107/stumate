import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { IUser } from '../users/users.interface';
import { CheckPolicies, ResponseMessage, User } from 'src/decorator/customize';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Deck } from './schema/deck.schema';
import { AbilityGuard } from 'src/casl/ability.guard';

@Controller('decks')
@ApiTags('decks')
@UseGuards(AbilityGuard)
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deck' })
  @CheckPolicies((ability) => ability.can(Action.CREATE, Deck))
  @ResponseMessage('Create a new deck')
  async create(@Body() createDeckDto: CreateDeckDto, @User() user: IUser) {
    const newDeck = await this.decksService.create(createDeckDto, user);
    console.log(newDeck);

    return {
      _id: newDeck?._id,
      createdAt: newDeck?.createdAt,
    };
  }

  @Post('user')
  @ApiOperation({ summary: 'Create a new deck for user' })
  @CheckPolicies((ability) => ability.can(Action.READ, Deck))
  @ResponseMessage('Get deck by user')
  getByUser(@User() user: IUser) {
    return this.decksService.findByUser(user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all decks' })
  @CheckPolicies((ability) => ability.can(Action.READ, Deck))
  @ResponseMessage('Fetch list deck with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.decksService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deck by id' })
  @CheckPolicies((ability) => ability.can(Action.READ, Deck))
  @ResponseMessage('Fetch deck by id')
  async findOne(@Param('id') id: string) {
    const foundDeck = await this.decksService.findOne(id);
    return foundDeck;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update deck by id' })
  @CheckPolicies((ability) => ability.can(Action.UPDATE, Deck))
  @ResponseMessage('Update a deck')
  async update(
    @Param('id') id: string,
    @Body() updateDeckDto: UpdateDeckDto,
    @User() user: IUser,
  ) {
    const updateDeck = await this.decksService.update(id, updateDeckDto, user);
    return updateDeck;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deck by id' })
  @CheckPolicies((ability) => ability.can(Action.DELETE, Deck))
  @ResponseMessage('Delete a deck')
  remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    return this.decksService.remove(id, user);
  }
}
