import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuizAttempt, QuizAttemptDocument } from './schema/quiz-attempt.schema';
import { InjectModel } from '@nestjs/mongoose';
import { QuizTestsService } from '../quiz-tests/quiz-tests.service';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import mongoose from 'mongoose';
import { UserAnswersDto } from './dto/submit-quiz-attempt.dto';
import { QuizQuestionsService } from '../quiz-questions/quiz-questions.service';
import { SoftDeleteModel } from 'mongoose-delete';
import { StatisticsService } from '../statistics/statistics.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class QuizAttemptsService {
  constructor(
    @InjectModel(QuizAttempt.name)
    private readonly quizAttemptModel: SoftDeleteModel<QuizAttemptDocument>,
    @Inject(forwardRef(() => QuizTestsService))
    private readonly quizTests: QuizTestsService,
    @Inject(forwardRef(() => QuizQuestionsService))
    private readonly quizQuestions: QuizQuestionsService,
    private readonly statisticsService: StatisticsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async handleStartQuizAttempt(quizTestId: string, @User() user: IUser) {
    const quizTest = await this.quizTests.findById(quizTestId);
    if (quizTest.ownerId.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }

    const quizAttempt = await this.quizAttemptModel.create({
      totalQuestions: quizTest.numberOfQuestion,
      answers: [],
      duration: quizTest.duration,
      userId: user._id,
      quizTestId,
      status: 'IN_PROGRESS',
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });

    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    return { quizAttempt, quizTest, user };
  }

  public async getAttemptData(attemptId: string, @User() user: IUser) {
    const quizAttempt = await this.quizAttemptModel
      .findById(attemptId)
      .populate('quizTestId');

    if (!quizAttempt) {
      throw new NotFoundException('Not found quiz attempt');
    }

    if (quizAttempt.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'You do not have permission to view this attempt',
      );
    }
    const questions = await this.quizQuestions.findByQuizTestId(
      (quizAttempt.quizTestId as any)._id.toString(),
      user,
    );

    return { quizAttempt, quizTest: quizAttempt.quizTestId, questions };
  }

  async handleSaveQuizAttempt(
    quizTestId: string,
    id: string,
    userAnswersDto: UserAnswersDto,
    @User() user: IUser,
  ) {
    const quizTest = await this.quizTests.findById(quizTestId);
    if (quizTest.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    const updatedQuizAttempt = await this.quizAttemptModel.findOneAndUpdate(
      { _id: id, quizTestId, userId: user._id },
      {
        ...userAnswersDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
    //send notification
    await this.notificationsService.sendInfoNotification(
      user,
      `Quiz Submission Reminder`,
      `Your quiz '${quizTest.name}' is in progress and has not been submitted. Don't forget to submit it when you're done!`,
    );
    return updatedQuizAttempt;
  }

  checkAnswerCorrect(question: any, userAnswers: string[]) {
    if (question.answerText) {
      const isTextCorrect =
        question.answerText.trim().toLowerCase() ===
        userAnswers[0]?.trim().toLowerCase();
      return isTextCorrect;
    }

    const correctOptions = question.answerOptions
      .filter((answerOption: any) => answerOption.isCorrect)
      .map((answerOption: any) => answerOption.option);
    const userAnswerSet = new Set(userAnswers);
    const isAllCorrect = correctOptions.every((answer: any) =>
      userAnswerSet.has(answer),
    );
    const countCorrectAnswer = userAnswerSet.size === correctOptions.length;
    return isAllCorrect && countCorrectAnswer;
  }

  message = (
    correctAnswers: number,
    totalQuestions: number,
    quizTitle: string,
  ) => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    if (percentage >= 90) {
      return `Excellent! You scored ${correctAnswers}/${totalQuestions} in the quiz '${quizTitle}'. Keep up the great work!`;
    } else if (percentage >= 80) {
      return `Well done! You scored ${correctAnswers}/${totalQuestions} in the quiz '${quizTitle}'. Keep pushing forward!`;
    } else if (percentage >= 50) {
      return `Good job! You scored ${correctAnswers}/${totalQuestions} in the quiz '${quizTitle}'. Keep improving and you'll get there!`;
    } else {
      return `You scored ${correctAnswers}/${totalQuestions} in the quiz '${quizTitle}'. Don't be discouraged, try again and improve your results!`;
    }
  };

  //websocket
  async handleSubmitQuizAttempt(
    quizTestId: string,
    id: string,
    userAnswersDto: UserAnswersDto,
    @User() user: IUser,
  ) {
    const quizTest = await this.quizTests.findById(quizTestId);
    if (quizTest.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    await this.findOne(quizTestId, id);
    //compute user score
    let score: number = 0;
    let correctAnswers: number = 0;
    const questionResults: {
      quizQuestionId: string;
      answer: string[];
      isCorrect: boolean;
    }[] = [];
    const quizQuestionIds = userAnswersDto.answers.map(
      (answer) => answer.quizQuestionId,
    );
    const questions = await this.quizQuestions.findAllById(quizQuestionIds);
    const questionObject = questions.reduce((map, question) => {
      map[question._id.toString()] = question;
      return map;
    }, {});
    for (const userAnswer of userAnswersDto.answers) {
      const question = questionObject[userAnswer.quizQuestionId];
      if (!question) continue;
      const isCorrect = this.checkAnswerCorrect(question, userAnswer.answer);
      if (isCorrect) {
        score += question.point;
        correctAnswers += 1;
      }
      questionResults.push({
        quizQuestionId: userAnswer.quizQuestionId,
        answer: userAnswer.answer,
        isCorrect,
      });
    }
    //Update quiz test status
    if (quizTest.status === 'IN_PROGRESS') {
      await quizTest.updateOne({ _id: quizTestId }, { status: 'COMPLETED' });
    } else {
      await quizTest.updateOne({ _id: quizTestId }, { status: 'REVIEWED' });
    }

    await this.quizAttemptModel.updateOne({ _id: id }, { status: 'COMPLETED' });
    //Update quiz attempt
    const updateQuizAttempt = await this.quizAttemptModel.findOneAndUpdate(
      { _id: id, quizTestId },
      {
        score,
        correctAnswers,
        answers: questionResults,
        createdBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
    //update user statistic
    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    //send notification
    await this.notificationsService.sendSuccessNotification(
      user,
      `Quiz Completed`,
      this.message(
        updateQuizAttempt.correctAnswers,
        updateQuizAttempt.totalQuestions,
        quizTest.name,
      ),
    );
    return updateQuizAttempt;
  }

  async findByQuizTestId(quizTestId: string, @User() user: IUser) {
    const quizTest = await this.quizTests.findById(quizTestId);
    if (quizTest.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return await this.quizAttemptModel.find({ quizTestId });
  }

  async findOne(quizTestId: string, id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Quiz Attempt ID');
    }
    const quizAttempt = await this.quizAttemptModel.findOne({
      _id: id,
      quizTestId,
    });
    if (!quizAttempt) {
      throw new NotFoundException('Not found quiz attempt');
    }
    return quizAttempt;
  }

  //websocket
  // async remove(quizTestId: string, id: string, @User() user: IUser) {
  //   if (!(await this.quizTests.findOne(quizTestId))) {
  //     throw new NotFoundException('Not found quiz test');
  //   }
  //   const quizAttempt = await this.quizAttemptModel.findOne({
  //     _id: id,
  //     quizTestId,
  //   });
  //   if (!quizAttempt) {
  //     throw new NotFoundException('Not found quiz attempt');
  //   }
  //   const userId = quizAttempt.userId.toString();
  //   await this.quizAttemptModel.delete({ _id: id, quizTestId }, user._id);
  //   await this.statisticsService.createOrUpdateUserStatistics(userId);
  //   return 'Quiz attempt was deleted successfully';
  // }
}
