import {
  BadRequestException,
  ForbiddenException,
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
import { QuizTestsService } from '../quiz-tests/quiz-tests.service';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import mongoose, { Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class QuizQuestionsService {
  constructor(
    @InjectModel(QuizQuestion.name)
    private readonly quizQuestionModel: SoftDeleteModel<QuizQuestionDocument>,
    @Inject(forwardRef(() => QuizTestsService))
    private readonly quizTestService: QuizTestsService,
  ) {}

  async create(
    quizTestId: string,
    createQuizQuestionDto: CreateQuizQuestionDto,
    @User() user: IUser,
  ) {
    const quizTest = await this.quizTestService.findOne(quizTestId);
    if (quizTest.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    const currentNumberOfQuestion = await this.quizQuestionModel.countDocuments(
      { quizTestId },
    );
    if (currentNumberOfQuestion >= quizTest.numberOfQuestion) {
      throw new BadRequestException(
        'Maximum number of questions has been reached',
      );
    }
    //Create a new quiz question
    const newQuizQuestion = await this.quizQuestionModel.create({
      ...createQuizQuestionDto,
      userId: user._id,
      quizTestId: quizTestId,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newQuizQuestion;
  }

  async createMultiple(
    quizTestId: string,
    createQuizQuestionDtos: CreateQuizQuestionDto[],
    user: IUser,
  ) {
    const quizTest = await this.quizTestService.findOne(quizTestId);

    if (quizTest.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }

    const currentNumberOfQuestion = await this.quizQuestionModel.countDocuments(
      { quizTestId },
    );
    const newNumberOfQuestion = createQuizQuestionDtos.length;

    if (
      currentNumberOfQuestion + newNumberOfQuestion >
      quizTest.numberOfQuestion
    ) {
      throw new BadRequestException(
        'Maximum number of questions has been reached',
      );
    }

    const questionsToCreate = createQuizQuestionDtos.map(
      (createQuizQuestionDto) => ({
        ...createQuizQuestionDto,
        userId: user._id,
        quizTestId: quizTestId,
        createdBy: {
          _id: user._id,
          username: user.username,
        },
      }),
    );

    const newQuizQuestions =
      await this.quizQuestionModel.insertMany(questionsToCreate);

    return { data: newQuizQuestions, _id: quizTestId };
  }

  async findByQuizTestId(quizTestId: string, user: IUser) {
    const quizTest = await this.quizTestService.findOne(quizTestId);
    if (quizTest.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return await this.quizQuestionModel.find({ quizTestId });
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
    return await this.quizQuestionModel.findOneAndUpdate(
      { _id: id, quizTestId },
      {
        ...updateQuizQuestionDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
  }

  async updateMultiple(
    quizTestId: string,
    updateQuestionData: UpdateQuizQuestionDto[],
    user: IUser,
  ) {
    // First, verify the quiz test belongs to the user (optional but recommended)
    const quizTest = await this.quizTestService.findOne(quizTestId);
    if (!quizTest || quizTest.userId.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        `You don't have permission to update these questions`,
      );
    }

    // Use bulkWrite for efficient multiple updates
    const bulkOperations = updateQuestionData.map((updateData) => ({
      updateOne: {
        filter: {
          _id: updateData._id,
          quizTestId: quizTestId,
        },
        update: {
          $set: {
            ...updateData,
            updatedBy: {
              _id: user._id,
              username: user.username,
            },
          },
        },
      },
    }));

    await this.quizQuestionModel.bulkWrite(bulkOperations);

    const updatedQuestions = await this.quizQuestionModel.find({
      _id: { $in: updateQuestionData.map((q) => q._id) },
      quizTestId: quizTestId,
    });

    return updatedQuestions;
  }

  async remove(quizTestId: string, id: string, @User() user: IUser) {
    const quizTest = await this.quizTestService.findOne(quizTestId);
    if (user.role === 'USER') {
      if (quizTest.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    const quizQuestion = await this.quizQuestionModel.findOne({
      _id: id,
      quizTestId,
    });
    if (!quizQuestion) {
      throw new NotFoundException('Not found quiz question');
    }
    return this.quizQuestionModel.delete({ _id: id, quizTestId }, user._id);
  }

  async removeMultiple(quizTestId: string, questionIds: string[], user: IUser) {
    const quizTest = await this.quizTestService.findOne(quizTestId);
    if (user.role === 'USER') {
      if (quizTest.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }

    const objectIdQuestionIds = questionIds.map((id) => new Types.ObjectId(id));

    const questions = await this.quizQuestionModel.find({
      _id: { $in: objectIdQuestionIds },
      quizTestId,
    });

    if (questions.length !== questionIds.length) {
      throw new NotFoundException('Some questions not found');
    }

    await this.quizQuestionModel.delete(
      {
        _id: { $in: objectIdQuestionIds },
        quizTestId,
      },
      questions[0].userId,
    );

    return questions;
  }
}
