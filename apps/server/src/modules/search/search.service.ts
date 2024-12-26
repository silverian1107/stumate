import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { DeckDocument } from '../decks/schema/deck.schema';
import { NoteDocument } from '../notes/schema/note.schema';
import { QuizTestDocument } from '../quiz-tests/schema/quiz-test.schema';
import { IUser } from '../users/users.interface';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel('Deck')
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel('Note')
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel('QuizTest')
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
  ) {}

  async searchEntities(
    user: IUser,
    query?: string,
    currentPage = 1,
    pageSize = 10,
  ) {
    if (!Number.isInteger(currentPage) || currentPage <= 0) {
      throw new BadRequestException('Current page must be a positive integer');
    }
    if (!Number.isInteger(pageSize) || pageSize <= 0) {
      throw new BadRequestException('Page size must be a positive integer');
    }

    if (!user || !user._id) {
      throw new BadRequestException(
        'User information is required for this operation',
      );
    }

    const skip = (currentPage - 1) * pageSize;
    const regex = query ? new RegExp(query, 'i') : null;

    try {
      const searchConditions = query
        ? {
            name: regex,
            updatedAt: { $exists: true },
            ownerId: user._id,
          }
        : { updatedAt: { $exists: true }, ownerId: user._id };
      const sortOptions = { updatedAt: -1 as const };

      const fetchResults = async (model, type) => {
        const results = await model
          .find(searchConditions)
          .sort(sortOptions)
          .exec();
        return results.map((item) => ({
          ...item.toObject(),
          type,
          updatedAt: item.updatedAt,
        }));
      };

      let results = [];
      for (const [model, type] of [
        [this.deckModel, 'deck'],
        [this.noteModel, 'note'],
        [this.quizTestModel, 'quizTest'],
      ]) {
        const modelResults = await fetchResults(model, type);
        results = results.concat(modelResults);
      }

      results.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      const totalItems = results.length;
      const totalPages = Math.ceil(totalItems / pageSize);

      results = results.slice(skip, skip + pageSize);

      return {
        meta: {
          current: currentPage,
          pageSize,
          pages: totalPages,
          total: totalItems,
        },
        result: results,
      };
    } catch (error) {
      throw new Error(`Failed to search entities: ${error.message}`);
    }
  }
}
