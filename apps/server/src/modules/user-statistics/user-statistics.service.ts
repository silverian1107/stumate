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
  Rating,
  State,
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
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { MyGateway } from 'src/gateway/gateway';

@Injectable()
export class UserStatisticsService {
  constructor(
    @InjectModel(UserStatistic.name)
    private readonly userStatisticModel: SoftDeleteModel<UserStatisticDocument>,
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @InjectModel(Note.name)
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel(QuizTest.name)
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @InjectModel(QuizAttempt.name)
    private readonly quizAttemptModel: SoftDeleteModel<QuizAttemptDocument>,
    private readonly myGateway: MyGateway,
  ) {}

  async findOne(@User() user: IUser) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    await this.userStatisticModel.findOne({
      _id: user._id.toString(),
      today: startOfDay,
    });
  }

  async createOrUpdate(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalNotesCount,
      totalFlashcardsCount,
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
            notesRevisedTodayCount: 0,
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
      notesRevisedTodayCount: 0,
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

    return newUserStatistic;
  }

  // async getDailyStudyDuration(userId: string) {

  // }

  // async getStudyStreakDays(userId: string) {

  // }

  async getTotalNotesCount(userId: string) {
    const notes = await this.noteModel.countDocuments({
      ownerId: userId,
    });
    return notes;
  }

  async getTotalFlashcardsCount(userId: string) {
    const flashcards = await this.flashcardModel.countDocuments({ userId });
    return flashcards;
  }

  // async getNotesRevisedTodayCount(userId: string) {
  //   const startOfDay = new Date();
  //   startOfDay.setHours(0, 0, 0, 0);
  //   const endOfDay = new Date();
  //   endOfDay.setHours(23, 59, 59, 999);
  //   const notesRevisedToday = await this.noteModel.countDocuments({
  //     ownerId: userId,
  //     updatedAt: { $gte: startOfDay, $lte: endOfDay },
  //   });
  //   return notesRevisedToday;
  // }

  async getFlashcardsDueTodayCount(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const cardsDueToday = await this.flashcardModel.countDocuments({
      userId,
      nextReview: { $gte: startOfDay.getTime(), $lte: endOfDay.getTime() },
    });
    return cardsDueToday;
  }

  async getTotalQuizzesCount(userId: string) {
    const quizzes = await this.quizTestModel.countDocuments({ userId });
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
    const flashcardsCompletedToday = await this.flashcardModel.countDocuments({
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
    const totalFlashcardsLearningToday =
      await this.getFlashcardsCompletedToday(userId);
    const flashcardsCompletedToday = await this.flashcardModel.countDocuments({
      userId,
      updatedAt: { $gte: startOfDay, $lte: endOfDay },
      rating: { $in: [Rating.Good, Rating.Easy] },
    });
    const progress =
      totalFlashcardsLearningToday > 0
        ? (flashcardsCompletedToday / totalFlashcardsLearningToday) * 100
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
    const studiedFlashcardsCount = await this.flashcardModel.countDocuments({
      userId,
      state: { $in: [State.Review, State.Relearning] },
    });
    return studiedFlashcardsCount;
  }

  // async getSessionsThisWeek(userId: string) {

  // }
}
