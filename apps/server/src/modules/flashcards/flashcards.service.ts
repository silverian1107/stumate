import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from '../users/users.interface';
import { User } from 'src/decorator/customize';
import { Flashcard, FlashcardDocument } from './schema/flashcard.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { DecksService } from '../decks/decks.service';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @Inject(forwardRef(() => DecksService))
    private readonly decks: DecksService,
  ) {}

  async create(
    deckId: string,
    createFlashcardDto: CreateFlashcardDto,
    @User() user: IUser,
  ) {
    if (!(await this.decks.findOne(deckId))) {
      throw new NotFoundException('Not found deck');
    }
    //Create a new flashcard
    const newFlashcard = await this.flashcardModel.create({
      ...createFlashcardDto,
      deckId: deckId,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newFlashcard;
  }

  async findByUserAndDeckId(deckId: string, user: IUser) {
    return await this.flashcardModel.find({ userId: user._id, deckId });
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    const totalItems = (await this.flashcardModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.flashcardModel
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

  async findOne(deckId: string, id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Flashcard ID');
    }
    const flashcard = await this.flashcardModel.findOne({ _id: id, deckId });
    if (!flashcard) {
      throw new NotFoundException('Not found flashcard');
    }
    return flashcard;
  }

  async update(
    deckId: string,
    id: string,
    updateFlashcardDto: UpdateFlashcardDto,
    @User() user: IUser,
  ) {
    return await this.flashcardModel.updateOne(
      { _id: id, deckId },
      {
        ...updateFlashcardDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
  }

  async remove(deckId: string, id: string, @User() user: IUser) {
    if (!(await this.decks.findOne(deckId))) {
      throw new NotFoundException('Not found deck');
    }
    const flashcard = await this.flashcardModel.findOne({ _id: id, deckId });
    if (!flashcard) {
      throw new NotFoundException('Not found flashcard');
    }
    await this.flashcardModel.updateOne(
      { _id: id, deckId },
      {
        deletedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
    return this.flashcardModel.softDelete({ _id: id, deckId });
  }
}
