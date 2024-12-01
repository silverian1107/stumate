import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck, DeckDocument } from './schema/deck.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../users/users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
  Flashcard,
  FlashcardDocument,
} from '../flashcards/schema/flashcard.schema';
import { handleDuplicateName } from 'src/helpers/utils';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class DecksService {
  constructor(
    @InjectModel(Deck.name)
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    private readonly statisticsService: StatisticsService,
  ) {}

  async create(createDeckDto: CreateDeckDto, @User() user: IUser) {
    // Check name already exists
    const existingDecks = await this.deckModel.find({ userId: user._id });
    const existingDeckNames = existingDecks.map((deck) => deck.name);
    const newDeckName = handleDuplicateName(
      createDeckDto.name,
      existingDeckNames,
    );
    //Create a new deck
    const newDeck = await this.deckModel.create({
      name: newDeckName,
      description: createDeckDto.description,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newDeck;
  }

  async findByUser(user: IUser, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    filter.userId = user._id;

    const totalItems = (await this.deckModel.find(filter)).length;
    const result = await this.deckModel
      .find(filter)
      .sort(sort as any)
      .select('-userId')
      .populate(population)
      .select(projection as any)
      .exec();
    return {
      total: totalItems,
      result,
    };
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    const totalItems = (await this.deckModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.deckModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .select('-userId')
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Deck ID');
    }
    const deck = await this.deckModel.findOne({ _id: id });
    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
    return deck;
  }

  async update(id: string, updateDeckDto: UpdateDeckDto, @User() user: IUser) {
    return await this.deckModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateDeckDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Deck ID');
    }
    const deck = await this.deckModel.findOne({
      _id: id,
      isArchived: true,
    });
    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
    const userId = deck.userId.toString();
    if (user.role === 'USER') {
      if (userId !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    //soft delete for all flashcard
    await this.flashcardModel.delete({ deckId: id }, user._id);
    //soft delete for deck
    await this.deckModel.delete({ _id: id }, user._id);
    await this.statisticsService.createOrUpdateUserStatistics(userId);
    return 'Deck was deleted successfully';
  }
}
