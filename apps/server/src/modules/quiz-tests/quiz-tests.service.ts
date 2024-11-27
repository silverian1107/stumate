import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuizTestDto } from './dto/create-quiz-test.dto';
import { UpdateQuizTestDto } from './dto/update-quiz-test.dto';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { QuizTest, QuizTestDocument } from './schema/quiz-test.schema';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
  QuizQuestion,
  QuizQuestionDocument,
} from '../quiz-questions/schema/quiz-question.schema';
import { StatisticsService } from '../statistics/statistics.service';

@Injectable()
export class QuizTestsService {
  constructor(
    @InjectModel(QuizTest.name)
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @InjectModel(QuizQuestion.name)
    private readonly quizQuestionModel: SoftDeleteModel<QuizQuestionDocument>,
    private readonly statisticsService: StatisticsService,
  ) {}

  async findQuizTestByTitle(name: string, userId: string) {
    return await this.quizTestModel.findOne({ name, userId });
  }

  //websocket
  async create(createQuizTestDto: CreateQuizTestDto, @User() user: IUser) {
    //Check title already exists
    // if (await this.findQuizTestByTitle(createQuizTestDto.name, user._id)) {
    //   throw new BadRequestException(
    //     `Title '${createQuizTestDto.name}' already exists`,
    //   );
    // }
    //Create a new quiz test
    const newQuizTest = await this.quizTestModel.create({
      ...createQuizTestDto,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    return newQuizTest;
  }

  // async createMultiple(createQuizTestDtos: CreateQuizTestDto[], user: IUser) {
  //   const titleSet = new Set();
  //   createQuizTestDtos.forEach((createQuizTestDto) => {
  //     if (titleSet.has(createQuizTestDto.title)) {
  //       throw new BadRequestException(
  //         `Title '${createQuizTestDto.title}' is duplicated`,
  //       );
  //     }
  //     titleSet.add(createQuizTestDto.title);
  //   });
  //   const newQuizTests = await Promise.all(
  //     createQuizTestDtos.map(async (createQuizTestDto) => {
  //       if (await this.isExistTitle(createQuizTestDto.title)) {
  //         throw new BadRequestException(
  //           `Title '${createQuizTestDto.title}' already exists`,
  //         );
  //       }
  //       return this.quizTestModel.create({
  //         ...createQuizTestDto,
  //         userId: user._id,
  //         createdBy: {
  //           _id: user._id,
  //           username: user.username,
  //         },
  //       });
  //     }),
  //   );

  //   return newQuizTests;
  // }

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
    return await this.quizTestModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateQuizTestDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
  }

  //websocket
  async remove(id: string, @User() user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Quiz Test ID');
    }
    const quizTest = await this.quizTestModel.findOne({
      _id: id,
      isArchived: true,
    });
    if (!quizTest) {
      throw new NotFoundException('Not found quiz test');
    }
    const userId = quizTest.userId.toString();
    //soft delete for quiz question
    await this.quizQuestionModel.delete({ quizTestId: id }, user._id);
    //soft delete for quiz test
    await this.quizTestModel.delete({ _id: id }, user._id);
    await this.statisticsService.createOrUpdateUserStatistics(userId);
    return 'Quiz was deleted successfully';
  }
}
