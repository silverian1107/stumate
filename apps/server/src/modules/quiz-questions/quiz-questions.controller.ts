import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { QuizQuestionsService } from './quiz-questions.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Role } from '../users/schema/user.schema';
import { ApiOperation } from '@nestjs/swagger';

@Controller('quiz-tests/:quizTestId/quiz-questions')
export class QuizQuestionsController {
  constructor(private readonly quizQuestionsService: QuizQuestionsService) {}

  @Post()
  @Roles(Role.USER)
  @ResponseMessage('Create a new quiz question')
  async create(
    @Param('quizTestId') quizTestId: string,
    @Body() createQuizQuestionDto: CreateQuizQuestionDto,
    @User() user: IUser,
  ) {
    const newQuizQuestion = await this.quizQuestionsService.create(
      quizTestId,
      createQuizQuestionDto,
      user,
    );
    return {
      _id: newQuizQuestion?._id,
      createdAt: newQuizQuestion?.createdAt,
    };
  }

  @Post('bulk')
  @Roles(Role.USER)
  @ResponseMessage('Create multiple quiz questions')
  async createMultiple(
    @Param('quizTestId') quizTestId: string,
    @Body() createQuizQuestionDtos: CreateQuizQuestionDto[],
    @User() user: IUser,
  ) {
    const newQuizQuestions = await this.quizQuestionsService.createMultiple(
      quizTestId,
      createQuizQuestionDtos,
      user,
    );
    return newQuizQuestions;
  }

  @Patch('bulk/update')
  @Roles(Role.USER)
  @ResponseMessage('Update multiple quiz questions')
  async updateMultiple(
    @Param('quizTestId') quizTestId: string,
    @Body() updateQuestionData: UpdateQuizQuestionDto[],
    @User() user: IUser,
  ) {
    const updatedQuizQuestions = await this.quizQuestionsService.updateMultiple(
      quizTestId,
      updateQuestionData,
      user,
    );

    return updatedQuizQuestions.map((question) => ({
      _id: question._id,
      question: question.question,
      questionType: question.questionType,
    }));
  }

  @Delete('bulk/delete')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Delete multiple quiz questions' })
  @ResponseMessage('Delete multiple quiz questions')
  async removeMultiple(
    @Param('quizTestId') quizTestId: string,
    @Body() questionIds: string[],
    @User() user: IUser,
  ): Promise<any> {
    return await this.quizQuestionsService.removeMultiple(
      quizTestId,
      questionIds,
      user,
    );
  }

  @Get('all')
  @Roles(Role.USER)
  @ResponseMessage('Get quiz question by quiz test')
  getByQuizTestId(
    @Param('quizTestId') quizTestId: string,
    @User() user: IUser,
  ) {
    return this.quizQuestionsService.findByQuizTestId(quizTestId, user);
  }

  @Get(':id')
  @ResponseMessage('Fetch quiz question by id')
  async findOne(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    const foundQuizQuestion = await this.quizQuestionsService.findOne(
      quizTestId,
      id,
    );
    if (user.role === 'USER') {
      if (foundQuizQuestion.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundQuizQuestion;
  }

  @Patch(':id')
  @Roles(Role.USER)
  @ResponseMessage('Update a quiz question')
  async update(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @Body() updateQuizQuestionDto: UpdateQuizQuestionDto,
    @User() user: IUser,
  ) {
    const foundQuizQuestion = await this.quizQuestionsService.findOne(
      quizTestId,
      id,
    );
    if (foundQuizQuestion.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return await this.quizQuestionsService.update(
      quizTestId,
      id,
      updateQuizQuestionDto,
      user,
    );
  }

  @Delete(':id')
  @ResponseMessage('Delete a quiz question')
  remove(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<any> {
    return this.quizQuestionsService.remove(quizTestId, id, user);
  }
}
