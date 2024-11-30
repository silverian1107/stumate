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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { IUser } from '../users/users.interface';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { Role } from '../users/schema/user.schema';

@Controller('decks')
@ApiTags('decks')
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new deck' })
  @ResponseMessage('Create a new deck')
  async create(@Body() createDeckDto: CreateDeckDto, @User() user: IUser) {
    const newDeck = await this.decksService.create(createDeckDto, user);
    return {
      _id: newDeck?._id,
      createdAt: newDeck?.createdAt,
    };
  }

  @Post('user')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new deck for user' })
  @ResponseMessage('Get deck by user')
  getByUser(@User() user: IUser) {
    return this.decksService.findByUser(user);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all decks' })
  @ResponseMessage('Fetch list deck with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.decksService.findAll(+currentPage, +pageSize, qs);
  }

  @Get()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Get all decks' })
  @ResponseMessage('Fetch list deck with pagination')
  findAllByUser(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
    @User() user: IUser,
  ) {
    return this.decksService.findAllByUser(+currentPage, +pageSize, qs, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deck by id' })
  @ResponseMessage('Fetch deck by id')
  async findOne(@Param('id') id: string, @User() user: IUser) {
    const foundDeck = await this.decksService.findOne(id);
    if (user.role === 'USER') {
      if (foundDeck.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundDeck;
  }

  @Patch(':id')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Update deck by id' })
  @ResponseMessage('Update a deck')
  async update(
    @Param('id') id: string,
    @Body() updateDeckDto: UpdateDeckDto,
    @User() user: IUser,
  ) {
    const foundDeck = await this.decksService.findOne(id);
    if (foundDeck.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return await this.decksService.update(id, updateDeckDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deck by id' })
  @ResponseMessage('Delete a deck')
  async remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    const foundDeck = await this.decksService.findOne(id);
    if (user.role === 'USER') {
      if (foundDeck.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return await this.decksService.remove(id, user);
  }
}
