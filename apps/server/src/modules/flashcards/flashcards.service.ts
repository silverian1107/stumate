import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateFlashcardDto,
  MarkFlashcardDTO,
} from './dto/create-flashcard.dto';
import {
  UpdateFlashcardDto,
  UpdateMultipleFlashcardDto,
} from './dto/update-flashcard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../users/users.interface';
import { User } from 'src/decorator/customize';
import { Flashcard, FlashcardDocument, State } from './schema/flashcard.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { DecksService } from '../decks/decks.service';
import dayjs from 'dayjs';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @Inject(forwardRef(() => DecksService))
    private readonly decks: DecksService,
  ) {}

  async createMultiple(
    deckId: string,
    createFlashcardData: CreateFlashcardDto[],
    user: IUser,
  ) {
    if (!(await this.decks.findOne(deckId))) {
      throw new NotFoundException('Deck not found');
    }
    const flashcards = createFlashcardData.map((cards) => ({
      ...cards,
      deckId: deckId,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    }));
    const newFlashcards = await this.flashcardModel.insertMany(flashcards);
    return newFlashcards;
  }

  async updateMultiple(
    deckId: string,
    updateFlashcardData: UpdateMultipleFlashcardDto[],
  ) {
    if (!(await this.decks.findOne(deckId))) {
      throw new NotFoundException('Deck not found');
    }
    const bulkOperations = updateFlashcardData.map((flashcard) => ({
      updateOne: {
        filter: { _id: flashcard._id },
        update: { front: flashcard.front, back: flashcard.back },
      },
    }));

    const result = await this.flashcardModel.bulkWrite(bulkOperations);
    return result;
  }

  getIntervalDate = (interval: number, date?: number) => {
    return dayjs(date ?? Date.now())
      .add(interval, 'day')
      .valueOf();
  };

  reviewFlashcard = (
    flashcard: FlashcardDocument,
    rating: number,
    reviewDate?: number,
  ) => {
    let interval: number;
    if (rating >= 3) {
      if (flashcard.repetitions === 0) {
        interval = 1;
      } else if (flashcard.repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(flashcard.interval * flashcard.easiness);
      }
      flashcard.repetitions++;
      let easiness =
        flashcard.easiness +
        (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
      if (easiness < 1.3) {
        easiness = 1.3;
      }
      flashcard.easiness = easiness;
    } else {
      flashcard.repetitions = 0;
      interval = 1;
    }
    flashcard.interval = interval;
    flashcard.nextReview = this.getIntervalDate(interval, reviewDate);
    return rating < 4;
  };

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

  async handleStudyFlashcard(deckId: string, user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
    const flashcards = await this.flashcardModel.find({
      userId: user._id,
      deckId,
    });
    await Promise.all(
      flashcards.map(async (flashcard) => {
        if (flashcard.state === State.New) {
          flashcard.state = State.Learning;
          flashcard.save();
        }
      }),
    );
    const dueFlashcards = flashcards.filter(
      (flashcard) => flashcard.nextReview <= Date.now(),
    );

    const sortedFlashcards = dueFlashcards.sort((a, b) => {
      if (a.nextReview !== b.nextReview) {
        return a.nextReview - b.nextReview;
      } else {
        return a.rating - b.rating;
      }
    });

    return {
      flashcards: sortedFlashcards.length > 0 ? sortedFlashcards : [],
      message: sortedFlashcards.length > 0 ? '' : 'No flashcard due for review',
    };
  }

  async handleMarkFlashcard(
    deckId: string,
    id: string,
    markFlashcardDTO: MarkFlashcardDTO,
    user: IUser,
  ) {
    const flashcard = await this.flashcardModel.findOne({
      _id: id,
      deckId,
      userId: user._id,
    });
    if (!flashcard) {
      throw new NotFoundException('Flashcard not found');
    }
    const isDueForReview = this.reviewFlashcard(
      flashcard,
      markFlashcardDTO.rating,
      markFlashcardDTO.reviewDate,
    );
    if (markFlashcardDTO.rating < 3) {
      flashcard.state = State.Relearning;
    } else if (flashcard.state === 0 || flashcard.state === 1) {
      flashcard.state = State.Review;
    }
    await flashcard.save();
    return {
      flashcard,
      isDueForReview,
    };
  }

  async handleDeckProgress(deckId: string, user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (!deck) {
      throw new NotFoundException('Deck not found');
    }

    const flashcards = await this.flashcardModel.find({
      userId: user._id,
      deckId,
    });
    const totalCards = flashcards.length;
    const reviewedCards = flashcards.filter(
      (flashcard) => flashcard.state === State.Review,
    ).length;
    const dueToday = flashcards.filter(
      (flashcard) => flashcard.nextReview <= Date.now(),
    ).length;
    const progress = totalCards > 0 ? (reviewedCards / totalCards) * 100 : 0;

    deck.studyStatus = {
      totalCards,
      reviewedCards,
      dueToday,
      progress,
      lastStudied: new Date(),
    };
    await deck.save();
    return deck;
  }

  async findByUserAndDeckId(deckId: string, user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
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
    return this.flashcardModel.delete({ _id: id, deckId }, user._id);
  }

  async handleGetAllFlashcards(deckId: string, user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
    const flashcards = await this.flashcardModel.find({
      userId: user._id,
      deckId,
    });
    return flashcards;
  }
}
