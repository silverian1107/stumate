import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { User } from 'src/decorator/customize';
import { handleDuplicateName } from 'src/helpers/utils';
import {
  Flashcard,
  FlashcardDocument,
} from '../flashcards/schema/flashcard.schema';
import { NotesService } from '../notes/notes.service';
import { StatisticsService } from '../statistics/statistics.service';
import { IUser } from '../users/users.interface';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { Deck, DeckDocument } from './schema/deck.schema';
import {
  FlashcardReview,
  FlashcardReviewDocument,
  State,
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
    private readonly noteService: NotesService,
    private readonly statisticsService: StatisticsService,
  ) {}

  async create(createDeckDto: CreateDeckDto, @User() user: IUser) {
    const { noteId, description } = createDeckDto;

    const promises = [];
    if (noteId) {
      promises.push(this.noteService.findById(noteId));
    } else {
      promises.push(Promise.resolve(null));
    }

    promises.push(this.deckModel.find({ userId: user._id }));

    const [, existingDecks] = await Promise.all(promises);

    const existingDeckNames = existingDecks.map((deck) => deck.name);
    const newDeckName = handleDuplicateName(
      createDeckDto.name,
      existingDeckNames,
    );
    //Create a new deck
    const newDeck = await this.deckModel.create({
      name: newDeckName,
      description,
      noteId: noteId || null,
      ownerId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newDeck;
  }

  async findByUser(user: IUser, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    filter.ownerId = user._id;

    const totalItems = (await this.deckModel.find(filter)).length;
    const result = await this.deckModel
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

  async findById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Deck ID');
    }
    const deck = await this.deckModel
      .findOne({
        _id: id,
        isArchived: { $in: [true, false] },
      })
      .populate('sharedWithUsers', 'email username')
      .exec();

    if (!deck) {
      throw new NotFoundException('Not found deck');
    }
    return deck;
  }

  async findDeckByNoteId(noteId: string, userId: string) {
    if (!noteId) {
      throw new BadRequestException('NoteId is required.');
    }

    const deck = await this.deckModel
      .findOne({ noteId, ownerId: userId })
      .exec();

    if (!deck) {
      throw new NotFoundException('No deck found with the given noteId.');
    }

    // Get flashcards ready for study using the service
    const flashcards = await this.handleStudyFlashcard(
      deck._id.toString(),
      userId,
    );

    return {
      deck: {
        _id: deck._id,
        name: deck.name,
        description: deck.description,
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
        noteId: deck.noteId,
      },
      flashcards: flashcards,
    };
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
    const userId = deck.ownerId.toString();
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
    await this.statisticsService.getAdminStatistics();
    return 'Deck was deleted successfully';
  }

  async handleStudyFlashcard(deckId: string, userId: string) {
    const flashcards = await this.flashcardModel.find({ deckId });
    const dueFlashcardReviews = [];

    for (const flashcard of flashcards) {
      let flashcardReview = await this.flashcardReviewModel
        .findOne({ flashcardId: flashcard._id, userId })
        .populate('flashcardId');

      // Create flashcard review if it doesn't exist
      if (!flashcardReview) {
        flashcardReview = await this.flashcardReviewModel.create({
          flashcardId: flashcard._id,
          userId,
          state: State.New,
          nextReview: Date.now(),
        });
      }

      if (flashcardReview.state === State.New) {
        flashcardReview.state = State.Learning;
        await flashcardReview.save();
      }

      if (flashcardReview.nextReview <= Date.now()) {
        dueFlashcardReviews.push(flashcardReview);
      }
    }

    const sortedFlashcards = dueFlashcardReviews.sort((a, b) => {
      if (a.nextReview !== b.nextReview) {
        return a.nextReview - b.nextReview;
      }
      return a.rating - b.rating;
    });

    return sortedFlashcards;
  }
}
