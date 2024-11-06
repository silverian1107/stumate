import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuizAttempt, QuizAttemptDocument } from './schema/quiz-attempt.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { QuizTestsService } from '../quiz-tests/quiz-tests.service';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { UserAnswersDto } from './dto/submit-quiz-attempt.dto';
import { QuizQuestionsService } from '../quiz-questions/quiz-questions.service';

@Injectable()
export class QuizAttemptsService {
  constructor(
    @InjectModel(QuizAttempt.name)
    private readonly quizAttemptModel: SoftDeleteModel<QuizAttemptDocument>,
    @Inject(forwardRef(() => QuizTestsService))
    private readonly quizTests: QuizTestsService,
    @Inject(forwardRef(() => QuizQuestionsService))
    private readonly quizQuestions: QuizQuestionsService,
  ) {}

  async handleStartQuizAttempt(quizTestId: string, @User() user: IUser) {
    const quizTest = await this.quizTests.findOne(quizTestId);
    if (!quizTest) {
      throw new NotFoundException('Not found quiz test');
    }
    //Update status for quiz test
    if (
      quizTest.status === 'NOT_STARTED' ||
      quizTest.status === 'IN_PROGRESS'
    ) {
      await quizTest.updateOne({ _id: quizTestId }, { status: 'IN_PROGRESS' });
    } else {
      await quizTest.updateOne({ _id: quizTestId }, { status: 'REVIEWING' });
    }
    //Create a new quiz attempt
    const newQuizAttempt = await this.quizAttemptModel.create({
      totalQuestions: quizTest.numberOfQuestion,
      answers: [],
      duration: quizTest.duration,
      userId: user._id,
      quizTestId,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return { newQuizAttempt, quizTest, user };
  }

  async handleSaveQuizAttempt(
    quizTestId: string,
    id: string,
    userAnswersDto: UserAnswersDto,
    @User() user: IUser,
  ) {
    return await this.quizAttemptModel.updateOne(
      { _id: id, quizTestId },
      {
        ...userAnswersDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
  }

  checkAnswerCorrect(question: any, userAnswer: any) {
    const isOptionCorrect = question.answerOptions.some(
      (answerOption: any) =>
        answerOption.option === userAnswer && answerOption.isCorrect,
    );
    const isTextCorrect =
      question.answerText.trim().toLowerCase() ===
      userAnswer.trim().toLowerCase();
    return isOptionCorrect || isTextCorrect;
  }

  async handleSubmitQuizAttempt(
    quizTestId: string,
    id: string,
    userAnswersDto: UserAnswersDto,
    @User() user: IUser,
  ) {
    const quizTest = await this.quizTests.findOne(quizTestId);
    if (!quizTest) {
      throw new NotFoundException('Not found quiz test');
    }
    const quizAttempt = await this.findOne(quizTestId, id);
    if (!quizAttempt) {
      throw new NotFoundException('Not found quiz attempt');
    }
    //compute user score
    let score: number = 0;
    let correctAnswers: number = 0;
    const questionResults: {
      quizQuestionId: string;
      answer: string;
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
        questionResults.push({
          quizQuestionId: userAnswer.quizQuestionId,
          answer: userAnswer.answer,
          isCorrect,
        });
      }
    }
    //Update quiz test status
    if (quizTest.status === 'COMPLETED') {
      await quizTest.updateOne({ _id: quizTestId }, { status: 'REVIEWED' });
    } else {
      await quizTest.updateOne({ _id: quizTestId }, { status: 'COMPLETED' });
    }
    //Update quiz attempt
    return await this.quizAttemptModel.updateOne(
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
    );
  }

  async findByUserAndQuizTestId(quizTestId: string, @User() user: IUser) {
    return await this.quizAttemptModel.find({ userId: user._id, quizTestId });
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    const totalItems = (await this.quizAttemptModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.quizAttemptModel
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

  async remove(quizTestId: string, id: string, @User() user: IUser) {
    if (!(await this.quizTests.findOne(quizTestId))) {
      throw new NotFoundException('Not found quiz test');
    }
    const quizAttempt = await this.quizAttemptModel.findOne({
      _id: id,
      quizTestId,
    });
    if (!quizAttempt) {
      throw new NotFoundException('Not found quiz attempt');
    }
    await this.quizAttemptModel.updateOne(
      { _id: id, quizTestId },
      {
        deletedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
    return this.quizAttemptModel.softDelete({ _id: id, quizTestId });
  }
}
