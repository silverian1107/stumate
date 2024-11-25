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
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../users/users.interface';
import { User } from 'src/decorator/customize';
import { Flashcard, FlashcardDocument } from './schema/flashcard.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { DecksService } from '../decks/decks.service';
import { SoftDeleteModel } from 'mongoose-delete';
import { StatisticsService } from '../statistics/statistics.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  FlashcardReview,
  FlashcardReviewDocument,
  State,
} from './schema/flashcard-review.schema';
import { reviewFlashcard } from './../../helpers/utils';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @InjectModel(FlashcardReview.name)
    private readonly flashcardReviewModel: SoftDeleteModel<FlashcardReviewDocument>,
    @Inject(forwardRef(() => DecksService))
    private readonly decks: DecksService,
    private readonly statisticsService: StatisticsService,
    private readonly notificationsService: NotificationsService,
  ) {}

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

  //websocket
  async createMultiple(
    deckId: string,
    createFlashcardDtos: CreateFlashcardDto[],
    user: IUser,
  ) {
    if (!(await this.decks.findOne(deckId))) {
      throw new NotFoundException('Not found deck');
    }
    const flashcards = createFlashcardDtos.map((createFlashcardDto) => ({
      ...createFlashcardDto,
      deckId: deckId,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    }));
    const newFlashcards = await this.flashcardModel.insertMany(flashcards);
    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    return newFlashcards;
  }

  //websocket
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
    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    return newFlashcard;
  }

  async handleStudyFlashcard(deckId: string, user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
    const flashcards = await this.flashcardModel.find({
      $or: [{ userId: user._id }, { sharedWithUsers: { $in: [user._id] } }],
      deckId,
    });

    const dueFlashcardReviews = [];

    await Promise.all(
      flashcards.map(async (flashcard) => {
        let flashcardReview = await this.flashcardReviewModel
          .findOne({
            userId: user._id,
            flashcardId: flashcard._id,
          })
          .populate('flashcardId');
        if (!flashcardReview) {
          flashcardReview = await this.flashcardReviewModel.create({
            flashcardId: flashcard._id,
            userId: user._id,
            state: State.New,
          });
          flashcardReview = await flashcardReview.populate('flashcardId');
        }
        if (flashcardReview.state === State.New) {
          flashcardReview.state = State.Learning;
          await flashcardReview.save();
        }
        if (flashcardReview.nextReview <= Date.now()) {
          dueFlashcardReviews.push(flashcardReview);
        }
      }),
    );

    const sortedFlashcards = dueFlashcardReviews.sort((a, b) => {
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

  //websocket
  async handleMarkFlashcard(
    flashcardId: string,
    markFlashcardDTO: MarkFlashcardDTO,
    user: IUser,
  ) {
    const flashcardReview = await this.flashcardReviewModel
      .findOne({
        userId: user._id,
        flashcardId: flashcardId,
      })
      .populate('flashcardId');
    if (!flashcardReview) {
      throw new NotFoundException('Not found flashcard review');
    }
    const isDueForReview = reviewFlashcard(
      flashcardReview,
      markFlashcardDTO.rating,
      markFlashcardDTO.reviewDate,
    );
    flashcardReview.rating = markFlashcardDTO.rating;
    if (markFlashcardDTO.rating < 3) {
      flashcardReview.state = State.Relearning;
    } else if (
      flashcardReview.state === 0 ||
      flashcardReview.state === 1 ||
      flashcardReview.state === 3
    ) {
      flashcardReview.state = State.Review;
    }
    await flashcardReview.save();
    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    return {
      flashcardReview,
      isDueForReview,
    };
  }

  async handleDeckProgress(deckId: string, user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
    const flashcards = await this.flashcardModel.find({
      $or: [{ userId: user._id }, { sharedWithUsers: { $in: [user._id] } }],
      deckId,
    });
    const flashcardReviews = await this.flashcardReviewModel.find({
      userId: user._id,
      flashcardId: { $in: flashcards.map((flashcard) => flashcard._id) },
    });
    const totalCards = flashcards.length;
    const reviewedCards = flashcardReviews.filter(
      (flashcardReview) => flashcardReview.state === State.Review,
    ).length;
    const dueToday = flashcardReviews.filter(
      (flashcardReview) => flashcardReview.nextReview <= Date.now(),
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
    //send notification
    const cardsDueToday =
      await this.statisticsService.getFlashcardsDueTodayCount(
        user._id.toString(),
      );
    if (cardsDueToday === 0) {
      await this.notificationsService.sendSuccessNotification(
        user,
        `All Cards Completed!`,
        `Awesome! You've finished reviewing all your cards for today. Keep it going!`,
      );
    }
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

  async findFlashcardReview(deckId: string, id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Flashcard ID');
    }
    const flashcard = await this.flashcardModel.findOne({ _id: id, deckId });
    if (!flashcard) {
      throw new NotFoundException('Not found flashcard');
    }
    const flashcardReview = await this.flashcardReviewModel.findOne({
      flashcardId: id,
    });
    if (!flashcardReview) {
      throw new NotFoundException('Not found flashcard review');
    }
    return flashcardReview;
  }

  async update(
    deckId: string,
    id: string,
    updateFlashcardDto: UpdateFlashcardDto,
    @User() user: IUser,
  ) {
    return await this.flashcardModel.findOneAndUpdate(
      { _id: id, deckId },
      {
        ...updateFlashcardDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
  }

  //websocket
  async remove(deckId: string, id: string, @User() user: IUser) {
    if (!(await this.decks.findOne(deckId))) {
      throw new NotFoundException('Not found deck');
    }
    const flashcard = await this.flashcardModel.findOne({ _id: id, deckId });
    if (!flashcard) {
      throw new NotFoundException('Not found flashcard');
    }
    const userId = flashcard.userId.toString();
    //soft delete for all flashcard review
    await this.flashcardReviewModel.delete({ flashcardId: id }, user._id);
    //soft delete for all flashcard
    await this.flashcardModel.delete({ _id: id, deckId }, user._id);
    await this.statisticsService.createOrUpdateUserStatistics(userId);
    return 'Flashcard was deleted successfully';
  }
}
