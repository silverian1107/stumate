import {
  BadRequestException,
  ForbiddenException,
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
import { Flashcard, FlashcardDocument } from './schema/flashcard.schema';
import aqp from 'api-query-params';
import mongoose, { Types } from 'mongoose';
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
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Note, NoteDocument } from '../notes/schema/note.schema';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @InjectModel(FlashcardReview.name)
    private readonly flashcardReviewModel: SoftDeleteModel<FlashcardReviewDocument>,
    @InjectModel(Note.name)
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @Inject(forwardRef(() => DecksService))
    private readonly decks: DecksService,
    private readonly statisticsService: StatisticsService,
    private readonly notificationsService: NotificationsService,
    private readonly httpService: HttpService,
  ) {}

  //websocket
  async handleCreateMultipleByAI(deckId: string, noteId: string, user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw new BadRequestException('Invalid Note ID');
    }
    const note = await this.noteModel.findOne({ _id: noteId });
    if (!note) {
      throw new NotFoundException('Not found note');
    }
    if (
      note.ownerId.toString() !== user._id ||
      deck.ownerId.toString() !== user._id
    ) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    const noteContent = note.body?.blocks
      ?.filter((block) => block.data?.text)
      .map((block) => block.data.text)
      .join(' ');
    if (!noteContent) {
      return 'Note content is empty';
    }
    const { data } = await firstValueFrom(
      this.httpService.post<{ Flashcards: { front: string; back: string }[] }>(
        'http://127.0.0.1:8000/generate-flashcards',
        { note_content: noteContent },
      ),
    );
    const flashcards = data.Flashcards.map((card) => ({
      front: card.front,
      back: card.back,
      deckId,
      userId: user._id,
      noteId,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    }));
    const newFlashcards = await this.flashcardModel.insertMany(flashcards);

    const flashcardReviews = newFlashcards.map((flashcard) => ({
      flashcardId: flashcard._id,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    }));
    await this.flashcardReviewModel.insertMany(flashcardReviews);

    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    await this.statisticsService.getAdminStatistics();
    return newFlashcards.map((flashcard: any) => ({
      _id: flashcard._id,
      createdAt: flashcard.createdAt,
    }));
  }

  async findByDeckAndUser(deckId: string, user: IUser, qs: string) {
    const deck = await this.decks.findOne(deckId);
    if (deck.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    const { filter, sort, population, projection } = aqp(qs);

    filter.userId = user._id;
    filter.deckId = deckId;

    const totalItems = (await this.flashcardModel.find(filter)).length;
    const result = await this.flashcardModel
      .find(filter)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();
    return {
      total: totalItems,
      result,
    };
  }

  //websocket
  async createMultiple(
    deckId: string,
    createFlashcardData: CreateFlashcardDto[],
    user: IUser,
  ) {
    const deck = await this.decks.findOne(deckId);
    if (deck.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    const flashcards = createFlashcardData.map((card) => ({
      ...card,
      deckId,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    }));
    const newFlashcards = await this.flashcardModel.insertMany(flashcards);

    const flashcardReviews = newFlashcards.map((flashcard) => ({
      flashcardId: flashcard._id,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    }));
    await this.flashcardReviewModel.insertMany(flashcardReviews);

    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    await this.statisticsService.getAdminStatistics();
    return newFlashcards;
  }

  async updateMultiple(
    deckId: string,
    updateFlashcardData: UpdateMultipleFlashcardDto[],
    user: IUser,
  ) {
    const deck = await this.decks.findOne(deckId);
    if (deck.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    const bulkOperations = updateFlashcardData.map((flashcard) => ({
      updateOne: {
        filter: { _id: flashcard._id },
        update: { front: flashcard.front, back: flashcard.back },
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    }));

    await this.flashcardModel.bulkWrite(bulkOperations);
    return { message: 'Update flashcard successfully' };
  }

  //websocket
  async create(
    deckId: string,
    createFlashcardDto: CreateFlashcardDto,
    @User() user: IUser,
  ) {
    const deck = await this.decks.findOne(deckId);
    if (deck.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
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
    await this.flashcardReviewModel.create({
      flashcardId: newFlashcard._id,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    await this.statisticsService.getAdminStatistics();
    return newFlashcard;
  }

  async handleStudyFlashcard(deckId: string, user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (deck.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    const flashcards = await this.flashcardModel.find({
      userId: user._id,
      deckId,
    });

    const dueFlashcardReviews = [];

    await Promise.all(
      flashcards.map(async (flashcard) => {
        const flashcardReview = await this.flashcardReviewModel
          .findOne({
            userId: user._id,
            flashcardId: flashcard._id,
          })
          .populate('flashcardId');
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
        flashcardId,
      })
      .populate('flashcardId');
    if (!flashcardReview) {
      throw new NotFoundException('Not found flashcard review');
    }
    if (flashcardReview.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
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
    if (deck.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    const flashcards = await this.flashcardModel.find({
      userId: user._id,
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
    if (deck.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
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

  async findFlashcardReview(flashcardId: string) {
    if (!mongoose.isValidObjectId(flashcardId)) {
      throw new BadRequestException('Invalid Flashcard ID');
    }
    const flashcardReview = await this.flashcardReviewModel.findOne({
      flashcardId,
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
    const deck = await this.decks.findOne(deckId);
    if (user.role === 'USER') {
      if (deck.ownerId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    const flashcard = await this.flashcardModel.findOne({ _id: id, deckId });
    if (!flashcard) {
      throw new NotFoundException('Not found flashcard');
    }
    const userId = flashcard.userId.toString();
    //soft delete for all flashcard review
    await this.flashcardReviewModel.updateOne(
      {
        flashcardId: id,
      },
      { $set: { nextReview: null } },
    );
    //soft delete for all flashcard
    await this.flashcardModel.delete({ _id: id, deckId }, user._id);
    await this.statisticsService.createOrUpdateUserStatistics(userId);
    await this.statisticsService.getAdminStatistics();
    return 'Flashcard was deleted successfully';
  }

  async removeMultiple(deckId: string, flashcardIds: string[], user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (user.role === 'USER') {
      if (deck.ownerId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }

    const objectIdFlashcardIds = flashcardIds.map(
      (id) => new Types.ObjectId(id),
    );

    const flashcards = await this.flashcardModel.find({
      _id: { $in: objectIdFlashcardIds },
      deckId,
    });

    if (flashcards.length !== flashcardIds.length) {
      throw new NotFoundException('Not found flashcard');
    }

    await this.flashcardReviewModel.updateMany(
      {
        flashcardId: { $in: objectIdFlashcardIds },
      },
      { $set: { nextReview: null } },
    );

    await this.flashcardModel.delete(
      {
        _id: { $in: objectIdFlashcardIds },
        deckId,
      },
      flashcards[0].userId,
    );

    await this.statisticsService.createOrUpdateUserStatistics(
      flashcards[0].userId.toString(),
    );
    await this.statisticsService.getAdminStatistics();

    return flashcards;
  }

  //websocket
  async removeAll(deckId: string, @User() user: IUser) {
    const deck = await this.decks.findOne(deckId);
    if (user.role === 'USER') {
      if (deck.ownerId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }

    const flashcards = await this.flashcardModel.find({
      deckId,
    });
    if (!flashcards || flashcards.length === 0) {
      throw new NotFoundException('No flashcards found in this deck');
    }

    const flashcardIds = flashcards.map((card) => card._id);

    await this.flashcardReviewModel.updateMany(
      {
        flashcardId: { $in: flashcardIds },
      },
      { $set: { nextReview: null } },
    );

    await this.flashcardModel.delete(
      { _id: { $in: flashcardIds }, deckId },
      user._id,
    );

    const userId = user._id;
    await this.statisticsService.createOrUpdateUserStatistics(userId);
    await this.statisticsService.getAdminStatistics();

    return { message: 'Flashcard deleted successfully' };
  }
}
