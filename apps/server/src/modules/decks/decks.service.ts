import {
  BadRequestException,
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
import {
  FlashcardReview,
  FlashcardReviewDocument,
} from '../flashcards/schema/flashcard-review.schema';

@Injectable()
export class DecksService {
  constructor(
    @InjectModel(Deck.name)
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @InjectModel(FlashcardReview.name)
    private readonly flashcardReviewModel: SoftDeleteModel<FlashcardReviewDocument>,
  ) {}

  async findDeckByName(name: string, @User() user: IUser) {
    return await this.deckModel.findOne({ name, userId: user._id });
  }

  async create(createDeckDto: CreateDeckDto, @User() user: IUser) {
    const { name, description } = createDeckDto;
    // Check name already exists
    if (await this.findDeckByName(name, user)) {
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
    const deck = await this.deckModel.findOne({ _id: id });
    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
    //soft delete for all flashcard review
    const flashcards = await this.flashcardModel.find({ deckId: id });
    await Promise.all(
      flashcards.map((flashcard: any) =>
        this.flashcardReviewModel.delete(
          { flashcardId: flashcard._id },
          user._id,
        ),
      ),
    );
    //soft delete for all flashcard
    await this.flashcardModel.delete({ deckId: id }, user._id);
    //soft delete for deck
    return this.deckModel.delete({ _id: id }, user._id);
  }
}
