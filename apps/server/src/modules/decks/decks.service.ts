import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck, DeckDocument } from './schema/deck.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class DecksService {
  constructor(
    @InjectModel(Deck.name)
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
  ) {}

  async findDeckByName(name: string) {
    return await this.deckModel.findOne({ name });
  }

  isExistName = async (name: string) => {
    const deck = await this.findDeckByName(name);
    if (deck) return true;
    return false;
  };

  async create(createDeckDto: CreateDeckDto, @User() user: IUser) {
    const { name, description } = createDeckDto;
    //Check name already exists
    if (await this.isExistName(name)) {
      throw new BadRequestException(`Name '${name}' already exists`);
    }
    //Create a new deck
    const newDeck = await this.deckModel.create({
      name,
      description,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newDeck;
  }

  async findByUser(user: IUser) {
    return await this.deckModel.find({ userId: user._id });
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
    return await this.deckModel.updateOne(
      { _id: id },
      {
        ...updateDeckDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Deck ID');
    }
    const deck = await this.deckModel.findOne({ _id: id });
    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
    await this.deckModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
    return this.deckModel.softDelete({ _id: id });
  }
}
