import {
  BadRequestException,
  ForbiddenException,
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
import { handleDuplicateName } from 'src/helpers/utils';

@Injectable()
export class QuizTestsService {
  constructor(
    @InjectModel(QuizTest.name)
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @InjectModel(QuizQuestion.name)
    private readonly quizQuestionModel: SoftDeleteModel<QuizQuestionDocument>,
    private readonly statisticsService: StatisticsService,
  ) {}

  //websocket
  async create(createQuizTestDto: CreateQuizTestDto, @User() user: IUser) {
    const name = createQuizTestDto.name;
    const restDto = { ...createQuizTestDto };
    delete restDto.name;
    //Check title already exists
    const existingQuizTests = await this.quizTestModel.find({
      ownerId: user._id,
    });
    const existingQuizTestNames = existingQuizTests.map(
      (quizTest) => quizTest.name,
    );
    const newQuizName = handleDuplicateName(name, existingQuizTestNames);
    //Create a new quiz test
    const newQuizTest = await this.quizTestModel.create({
      name: newQuizName,
      ...restDto,
      ownerId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    await this.statisticsService.createOrUpdateUserStatistics(user._id);
    await this.statisticsService.getAdminStatistics();
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

  async findByUser(user: IUser, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);

    filter.ownerId = user._id;

    const totalItems = (await this.quizTestModel.find(filter)).length;
    const result = await this.quizTestModel
      .find(filter)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();
    return {
      total: totalItems,
      result,
    };
  }

  async getWithPagination(user: IUser, currentPage = 1, pageSize = 10) {
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

    try {
      const filter = { ownerId: user._id };

      const totalItems = await this.quizTestModel.countDocuments(filter).exec();
      const results = await this.quizTestModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec();

      const totalPages = Math.ceil(totalItems / pageSize);

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
      throw new Error(`Failed to get paginated results: ${error.message}`);
    }
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

  async findById(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Quiz Test ID');
    }
    const quizTest = await this.quizTestModel
      .findOne({
        _id: id,
        isArchived: { $in: [true, false] },
      })
      .populate('sharedWithUsers', 'email username')
      .exec();
    if (!quizTest) {
      throw new NotFoundException('Not found quiz test');
    }
    return quizTest;
  }

  async findByNoteId(noteId: string, @User() user: IUser) {
    if (!mongoose.isValidObjectId(noteId)) {
      throw new BadRequestException('Invalid Note ID');
    }
    const quizTest = await this.quizTestModel.findOne({
      noteId,
      ownerId: user._id,
    });

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
    const userId = quizTest.ownerId.toString();
    if (user.role === 'USER') {
      if (userId !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    //soft delete for quiz question
    await this.quizQuestionModel.delete(
      { quizTestId: id, isArchived: true },
      user._id,
    );
    //soft delete for quiz test
    await this.quizTestModel.delete({ _id: id, isArchived: true }, user._id);
    await this.statisticsService.createOrUpdateUserStatistics(userId);
    await this.statisticsService.getAdminStatistics();
    return 'Quiz was deleted successfully';
  }
}
