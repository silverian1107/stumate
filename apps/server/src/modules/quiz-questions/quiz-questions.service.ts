import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  QuizQuestion,
  QuizQuestionDocument,
} from './schema/quiz-question.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { QuizTestsService } from '../quiz-tests/quiz-tests.service';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class QuizQuestionsService {
  constructor(
    @InjectModel(QuizQuestion.name)
    private readonly quizQuestionModel: SoftDeleteModel<QuizQuestionDocument>,
    @Inject(forwardRef(() => QuizTestsService))
    private readonly quizTestModel: QuizTestsService,
  ) {}

  async create(
    quizTestId: string,
    createQuizQuestionDto: CreateQuizQuestionDto,
    @User() user: IUser,
  ) {
    if (!(await this.quizTestModel.findOne(quizTestId))) {
      throw new NotFoundException('Not found quiz test');
    }
    //Create a new quiz question
    const newQuizQuestion = await this.quizQuestionModel.create({
      ...createQuizQuestionDto,
      quizTestId: quizTestId,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newQuizQuestion;
  }

  async findByQuizTestId(quizTestId: string) {
    return await this.quizQuestionModel.find({ quizTestId });
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    const totalItems = (await this.quizQuestionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.quizQuestionModel
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
      throw new BadRequestException('Invalid Quiz Question ID');
    }
    const quizQuestion = await this.quizQuestionModel.findOne({
      _id: id,
      quizTestId,
    });
    if (!quizQuestion) {
      throw new NotFoundException('Not found quiz question');
    }
    return quizQuestion;
  }

  async findAllById(ids: string[]) {
    return await this.quizQuestionModel.find({ _id: { $in: ids } });
  }

  async update(
    quizTestId: string,
    id: string,
    updateQuizQuestionDto: UpdateQuizQuestionDto,
    @User() user: IUser,
  ) {
    return await this.quizQuestionModel.updateOne(
      { _id: id, quizTestId },
      {
        ...updateQuizQuestionDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
  }

  async remove(quizTestId: string, id: string, @User() user: IUser) {
    if (!(await this.quizTestModel.findOne(quizTestId))) {
      throw new NotFoundException('Not found quiz test');
    }
    const quizQuestion = await this.quizQuestionModel.findOne({
      _id: id,
      quizTestId,
    });
    if (!quizQuestion) {
      throw new NotFoundException('Not found quiz question');
    }
    await this.quizQuestionModel.updateOne(
      { _id: id, quizTestId },
      {
        deletedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
    return this.quizQuestionModel.softDelete({ _id: id, quizTestId });
  }
}
