import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  QuizQuestion,
  QuizQuestionDocument,
} from '../quiz-questions/schema/quiz-question.schema';
import { IUser } from '../users/users.interface';
import {
  CustomAttempt,
  CustomAttemptDocument,
} from './schema/custom-attempt.schema';

@Injectable()
export class CustomAttemptService {
  constructor(
    @InjectModel(CustomAttempt.name)
    private customAttemptModel: Model<CustomAttemptDocument>,
    @InjectModel(QuizQuestion.name)
    private quizQuestionModel: Model<QuizQuestionDocument>,
  ) {}

  async createCustomAttempt(
    user: IUser,
    selectedQuizzes: string[],
    duration: number,
    numberOfQuestions: number,
  ): Promise<CustomAttempt> {
    const questions = await this.quizQuestionModel
      .find({ quizTestId: { $in: selectedQuizzes } })
      .exec();

    const selectedQuestions = this.randomlySelectQuestions(
      questions,
      numberOfQuestions,
    );

    // Create custom attempt
    const customAttempt = new this.customAttemptModel({
      selectedQuizzes,
      duration,
      answers: selectedQuestions,
      totalQuestions: selectedQuestions.length,
      userId: user._id,
      score: 0,
      status: 'NOT_STARTED',
      createdBy: { _id: user._id, username: user.name },
      updatedBy: { _id: user._id, username: user.name },
    });

    return customAttempt.save();
  }

  private randomlySelectQuestions(
    questions: QuizQuestionDocument[],
    count: number,
  ) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((question) => ({
      quizQuestionId: question._id,
      answer: [],
      isCorrect: false,
    }));
  }
}
