import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Srs, SrsDocument } from './schema/sr.entity';
import {
  createEmptyCard,
  fsrs,
  FSRSParameters,
  generatorParameters,
  Rating,
  State,
} from 'ts-fsrs';

// const dueCardsQuery = {
//   'repetitionData.due': { $lte: new Date() },
// };

@Injectable()
export class SrsService {
  constructor(
    @InjectModel(Srs.name) private srsModel: SoftDeleteModel<SrsDocument>,
  ) {}

  async createSrs(front: string, back: string): Promise<Srs> {
    const newSrs = new this.srsModel({
      front,
      back,
      repetitionData: {
        lapses: 0,
        state: 'New',
        last_review: undefined,
        due: new Date(),
        stability: undefined,
        difficulty: undefined,
        elapsed_days: 0,
        scheduled_days: 0,
      },
    });
    return await newSrs.save();
  }

  async getAllSrs(): Promise<Srs[]> {
    return await this.srsModel.find().exec();
  }

  async studyCard(cardId: string): Promise<void> {
    // Fetch the card from the database
    const card = await this.srsModel.findById(cardId).exec();

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const emptyCard = createEmptyCard(new Date());

    const params: FSRSParameters = generatorParameters({
      enable_fuzz: true,
      enable_short_term: false,
      request_retention: 0, // Lower retention rate for new cards
      maximum_interval: 30, // Maximum interval before review
      w: [0.01, 3, 7, 15, 30], // Custom spacing between reviews
    });

    const f = fsrs(params);

    const scheduling_cards = f.repeat(emptyCard, new Date());
    // console.log(scheduling_cards);

    // Update the card with the scheduled information
    await this.srsModel.findByIdAndUpdate(cardId, {
      $set: {
        'repetitionData.due': scheduling_cards[Rating.Again].card.due,
        'repetitionData.last_review': scheduling_cards[Rating.Again].log.review,
        'repetitionData.stability':
          scheduling_cards[Rating.Again].card.stability,
        'repetitionData.difficulty':
          scheduling_cards[Rating.Again].card.difficulty,
        'repetitionData.reps': scheduling_cards[Rating.Again].card.reps + 1,
        'repetitionData.lapses': scheduling_cards[Rating.Again].card.lapses,
        'repetitionData.state': State.Review,
      },
      $inc: {
        'repetitionData.elapsed_days': 1,
      },
    });
  }

  async getDueCards(): Promise<Srs[]> {
    const dueCardsQuery = {
      'repetitionData.due': { $lte: new Date() },
    };

    return await this.srsModel.find(dueCardsQuery).exec();
  }
}
