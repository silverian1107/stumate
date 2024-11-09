import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuizQuestionsService } from './quiz-questions.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller('quiz-tests/:quizTestId/quiz-questions')
export class QuizQuestionsController {
  constructor(private readonly quizQuestionsService: QuizQuestionsService) {}

  @Post()
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

  @Post('multiple')
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
    return newQuizQuestions.map((question) => ({
      _id: question?._id,
      createdAt: question?.createdAt,
    }));
  }

  @Post('all')
  @ResponseMessage('Get quiz question by quiz test')
  getByQuizTestId(@Param('quizTestId') quizTestId: string) {
    return this.quizQuestionsService.findByQuizTestId(quizTestId);
  }

  @Get()
  @ResponseMessage('Fetch list quiz question with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.quizQuestionsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch quiz question by id')
  async findOne(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
  ) {
    const foundQuizTest = await this.quizQuestionsService.findOne(
      quizTestId,
      id,
    );
    return foundQuizTest;
  }

  @Patch(':id')
  @ResponseMessage('Update a quiz question')
  async update(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @Body() updateQuizQuestionDto: UpdateQuizQuestionDto,
    @User() user: IUser,
  ) {
    const updateQuizQuestion = await this.quizQuestionsService.update(
      quizTestId,
      id,
      updateQuizQuestionDto,
      user,
    );
    return updateQuizQuestion;
  }

  @Delete(':id')
  @ResponseMessage('Delete a quiz question')
  remove(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    return this.quizQuestionsService.remove(quizTestId, id, user);
  }
}
