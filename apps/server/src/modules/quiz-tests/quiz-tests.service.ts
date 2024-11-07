import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizTestDto } from './dto/create-quiz-test.dto';
import { UpdateQuizTestDto } from './dto/update-quiz-test.dto';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { QuizTest, QuizTestDocument } from './schema/quiz-test.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { QuizQuestionsService } from '../quiz-questions/quiz-questions.service';
import { QuizAttemptsService } from '../quiz-attempts/quiz-attempts.service';

@Injectable()
export class QuizTestsService {
  constructor(
    @InjectModel(QuizTest.name)
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @Inject(forwardRef(() => QuizQuestionsService))
    private readonly quizQuestionModel: QuizQuestionsService,
    @Inject(forwardRef(() => QuizAttemptsService))
    private readonly quizAttemptModel: QuizAttemptsService,
  ) {}

  async findQuizTestByTitle(title: string) {
    return await this.quizTestModel.findOne({ title });
  }

  isExistTitle = async (title: string) => {
    const quizTest = await this.findQuizTestByTitle(title);
    if (quizTest) return true;
    return false;
  };

  async create(createQuizTestDto: CreateQuizTestDto, @User() user: IUser) {
    //Check title already exists
    if (await this.isExistTitle(createQuizTestDto.title)) {
      throw new BadRequestException(
        `Title '${createQuizTestDto.title}' already exists`,
      );
    }
    //Create a new quiz test
    const newQuizTest = await this.quizTestModel.create({
      ...createQuizTestDto,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newQuizTest;
  }

  async findByUser(user: IUser) {
    return await this.quizTestModel.find({ userId: user._id });
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    const totalItems = (await this.quizTestModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.quizTestModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .select('-userId')
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

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Quiz Test ID');
    }
    const quizTest = await this.quizTestModel.findOne({ _id: id });
    if (!quizTest) {
      throw new NotFoundException('Not found quiz test');
    }
    return quizTest;
  }

  async update(
    id: string,
    updateQuizTestDto: UpdateQuizTestDto,
    @User() user: IUser,
  ) {
    return await this.quizTestModel.updateOne(
      { _id: id },
      {
        ...updateQuizTestDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Quiz Test ID');
    }
    const quizTest = await this.quizTestModel.findOne({ _id: id });
    if (!quizTest) {
      throw new NotFoundException('Not found quiz test');
    }
    //soft delete for quiz question
    const quizQuestions = await this.quizQuestionModel.findByQuizTestId(id);
    await Promise.all(
      quizQuestions.map((quizQuestion: any) =>
        this.quizQuestionModel.remove(id, quizQuestion._id.toString(), user),
      ),
    );
    //soft delete for quiz attempt
    const quizAttempts = await this.quizAttemptModel.findByUserAndQuizTestId(
      id,
      user,
    );
    await Promise.all(
      quizAttempts.map((quizAttempt: any) =>
        this.quizAttemptModel.remove(id, quizAttempt._id.toString(), user),
      ),
    );
    //soft delete for quiz test
    await this.quizTestModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          username: user.username,
        },
      },
    );
    return this.quizTestModel.softDelete({ _id: id });
  }
}
