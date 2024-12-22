import { Injectable } from '@nestjs/common';
import {
  UserStatistic,
  UserStatisticDocument,
} from './schema/user-statistic.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
  Flashcard,
  FlashcardDocument,
} from '../flashcards/schema/flashcard.schema';
import { Note, NoteDocument } from '../notes/schema/note.schema';
import {
  QuizTest,
  QuizTestDocument,
} from '../quiz-tests/schema/quiz-test.schema';
import {
  QuizAttempt,
  QuizAttemptDocument,
} from '../quiz-attempts/schema/quiz-attempt.schema';
import { MyGateway } from 'src/gateway/gateway';
import {
  FlashcardReview,
  FlashcardReviewDocument,
  Rating,
  State,
} from '../flashcards/schema/flashcard-review.schema';
import { Deck, DeckDocument } from '../decks/schema/deck.schema';
import { User as UserModel, UserDocument } from '../users/schema/user.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(UserStatistic.name)
    private readonly userStatisticModel: SoftDeleteModel<UserStatisticDocument>,
    @InjectModel(Deck.name)
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @InjectModel(FlashcardReview.name)
    private readonly flashcardReviewModel: SoftDeleteModel<FlashcardReviewDocument>,
    @InjectModel(Note.name)
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel(QuizTest.name)
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @InjectModel(QuizAttempt.name)
    private readonly quizAttemptModel: SoftDeleteModel<QuizAttemptDocument>,
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly myGateway: MyGateway,
  ) {}

  async getAdminStatistics() {
    const overview = {
      totalAccounts: (await this.getStatistics(this.userModel)).total,
      totalNotes: (await this.getStatistics(this.noteModel)).total,
      totalFlashcards: (await this.getStatistics(this.flashcardModel)).total,
      totalQuizzes: (await this.getStatistics(this.quizTestModel)).total,
    };
    const monthlyStatisticsChart = {
      totalAccounts: (await this.getStatistics(this.userModel))
        .monthlyStatistics,
      totalNotes: (await this.getStatistics(this.noteModel)).monthlyStatistics,
      totalFlashcards: (await this.getStatistics(this.flashcardModel))
        .monthlyStatistics,
      totalQuizzes: (await this.getStatistics(this.quizTestModel))
        .monthlyStatistics,
    };
    this.myGateway.sendAdminStatistics({
      overview,
      monthlyStatisticsChart,
    });
    return {
      overview,
      monthlyStatisticsChart,
    };
  }

  async getStatistics(model: any) {
    const total = await model.countDocuments();
    const monthlyStatistics = await model.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);
    return {
      total,
      monthlyStatistics,
    };
  }

  async createOrUpdateUserStatistics(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalNotesCount,
      totalFlashcardsCount,
      sharedResourcesCount,
      flashcardsDueTodayCount,
      totalQuizzesCount,
      quizzesCompletedToday,
      flashcardsCompletedToday,
      flashcardMasteryProgressToday,
      accuracyRate,
      accuracyRateToday,
      lowAccuracyCount,
      studiedFlashcardsCount,
    ] = await Promise.all([
      this.getTotalNotesCount(userId),
      this.getTotalFlashcardsCount(userId),
      this.getSharedResourcesCount(userId),
      this.getFlashcardsDueTodayCount(userId),
      this.getTotalQuizzesCount(userId),
      this.getQuizzesCompletedToday(userId),
      this.getFlashcardsCompletedToday(userId),
      this.getFlashcardMasteryProgressToday(userId),
      this.getAccuracyRate(userId),
      this.getAccuracyRateToday(userId),
      this.getLowAccuracyCount(userId),
      this.getStudiedFlashcardsCount(userId),
    ]);

    const existingStatistic = await this.userStatisticModel.findOne({
      userId,
      date: startOfDay,
    });
    if (existingStatistic) {
      const updateExistingStatistic =
        await this.userStatisticModel.findOneAndUpdate(
          { userId, date: startOfDay },
          {
            dailyStudyDuration: 0,
            studyStreakDays: 0,
            totalNotesCount,
            totalFlashcardsCount,
            sharedResourcesCount,
            flashcardsDueTodayCount,
            totalQuizzesCount,
            quizzesCompletedToday,
            flashcardsCompletedToday,
            flashcardMasteryProgressToday,
            accuracyRate,
            accuracyRateToday,
            lowAccuracyCount,
            studiedFlashcardsCount,
            dailyTaskList: [],
            completedTasksCount: 0,
            sessionsThisWeek: 0,
            monthlyStudyHeatmap: [],
          },
          { new: true },
        );
      this.myGateway.sendUpdate(updateExistingStatistic);
      return updateExistingStatistic;
    }

    const newUserStatistic = await this.userStatisticModel.create({
      userId,
      date: startOfDay,
      dailyStudyDuration: 0,
      studyStreakDays: 0,
      totalNotesCount,
      totalFlashcardsCount,
      sharedResourcesCount,
      flashcardsDueTodayCount,
      totalQuizzesCount,
      quizzesCompletedToday,
      flashcardsCompletedToday,
      flashcardMasteryProgressToday,
      accuracyRate,
      accuracyRateToday,
      lowAccuracyCount,
      studiedFlashcardsCount,
      dailyTaskList: [],
      completedTasksCount: 0,
      sessionsThisWeek: 0,
      monthlyStudyHeatmap: [],
    });
    this.myGateway.sendUpdate(newUserStatistic);

    return newUserStatistic;
  }

  async getTotalNotesCount(userId: string) {
    const notes = await this.noteModel.countDocuments({
      ownerId: userId,
    });
    return notes;
  }

  async getTotalFlashcardsCount(userId: string) {
    const flashcards = await this.flashcardModel.countDocuments({
      userId,
    });
    return flashcards;
  }

  async getSharedResourcesCount(userId: string) {
    const sharedNotes = await this.noteModel.countDocuments({
      sharedWithUsers: { $in: [userId] },
    });
    const sharedDecks = await this.deckModel.countDocuments({
      sharedWithUsers: { $in: [userId] },
    });
    const sharedQuizzes = await this.quizTestModel.countDocuments({
      sharedWithUsers: { $in: [userId] },
    });
    return sharedNotes + sharedDecks + sharedQuizzes;
  }

  async getFlashcardsDueTodayCount(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const cardsDueToday = await this.flashcardReviewModel.countDocuments({
      userId,
      nextReview: { $gte: startOfDay.getTime(), $lte: endOfDay.getTime() },
    });
    return cardsDueToday;
  }

  async getTotalQuizzesCount(userId: string) {
    const quizzes = await this.quizTestModel.countDocuments({
      userId,
    });
    return quizzes;
  }

  async getQuizzesCompletedToday(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const quizAttemptsToday = await this.quizAttemptModel.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const completedQuizTestIds = new Set(
      quizAttemptsToday.map((attempt) => attempt.quizTestId),
    );
    return completedQuizTestIds.size;
  }

  async getFlashcardsCompletedToday(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const flashcardsCompletedToday =
      await this.flashcardReviewModel.countDocuments({
        userId,
        updatedAt: { $gte: startOfDay, $lte: endOfDay },
        state: { $in: [State.Review, State.Relearning] },
      });
    return flashcardsCompletedToday;
  }

  async getFlashcardMasteryProgressToday(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const totalFlashcardsCompletedToday =
      await this.getFlashcardsCompletedToday(userId);
    const totalFlashcardsMasteryToday =
      await this.flashcardReviewModel.countDocuments({
        userId,
        updatedAt: { $gte: startOfDay, $lte: endOfDay },
        rating: { $in: [Rating.Good, Rating.Easy] },
      });
    const progress =
      totalFlashcardsCompletedToday > 0
        ? (totalFlashcardsMasteryToday / totalFlashcardsCompletedToday) * 100
        : 0;
    return progress;
  }

  async getAccuracyRate(userId: string) {
    const quizAttempts = await this.quizAttemptModel.find({ userId });
    const totalQuestions = quizAttempts.reduce(
      (sum, attempt) => sum + attempt.totalQuestions,
      0,
    );
    const totalCorrectAnswers = quizAttempts.reduce(
      (sum, attempt) => sum + attempt.correctAnswers,
      0,
    );
    const accuracyRate =
      totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0;
    return accuracyRate;
  }

  async getAccuracyRateToday(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const quizAttempts = await this.quizAttemptModel.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });
    const totalQuestions = quizAttempts.reduce(
      (sum, attempt) => sum + attempt.totalQuestions,
      0,
    );
    const totalCorrectAnswers = quizAttempts.reduce(
      (sum, attempt) => sum + attempt.correctAnswers,
      0,
    );
    const accuracyRate =
      totalQuestions > 0 ? (totalCorrectAnswers / totalQuestions) * 100 : 0;
    return accuracyRate;
  }

  async getLowAccuracyCount(userId: string) {
    const quizAttempts = await this.quizAttemptModel.find({ userId });
    const completedQuizTestIds = new Set(
      quizAttempts.map((attempt) => attempt.quizTestId.toString()),
    );
    const quizTestsAccuracy = {};
    quizAttempts.forEach((attempt) => {
      const accuracy =
        attempt.totalQuestions > 0
          ? attempt.correctAnswers / attempt.totalQuestions
          : 0;

      if (!quizTestsAccuracy[attempt.quizTestId.toString()]) {
        quizTestsAccuracy[attempt.quizTestId.toString()] = [];
      }
      quizTestsAccuracy[attempt.quizTestId.toString()].push(accuracy);
    });
    let lowAccuracyCount = 0;
    completedQuizTestIds.forEach((quizTestId) => {
      const accuracies = quizTestsAccuracy[quizTestId];
      const maxAccuracy = Math.max(...accuracies);
      if (maxAccuracy < 0.5) {
        lowAccuracyCount++;
      }
    });
    return lowAccuracyCount;
  }

  async getStudiedFlashcardsCount(userId: string) {
    const studiedFlashcardsCount =
      await this.flashcardReviewModel.countDocuments({
        userId,
        state: { $in: [State.Review, State.Relearning] },
      });
    return studiedFlashcardsCount;
  }
}
