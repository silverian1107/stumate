import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizQuestionsService } from './quiz-questions.service';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { UpdateQuizQuestionDto } from './dto/update-quiz-question.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { AbilityGuard } from 'src/casl/ability.guard';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { QuizQuestion } from './schema/quiz-question.schema';

@Controller('quiz-tests/:quizTestId/quiz-questions')
@UseGuards(AbilityGuard)
export class QuizQuestionsController {
  constructor(private readonly quizQuestionsService: QuizQuestionsService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, QuizQuestion))
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
  @CheckPolicies((ability) => ability.can(Action.CREATE, QuizQuestion))
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
  @CheckPolicies((ability) => ability.can(Action.READ, QuizQuestion))
  @ResponseMessage('Get quiz question by quiz test')
  getByQuizTestId(@Param('quizTestId') quizTestId: string) {
    return this.quizQuestionsService.findByQuizTestId(quizTestId);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, QuizQuestion))
  @ResponseMessage('Fetch list quiz question with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.quizQuestionsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, QuizQuestion))
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
  @CheckPolicies((ability) => ability.can(Action.UPDATE, QuizQuestion))
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
  @CheckPolicies((ability) => ability.can(Action.DELETE, QuizQuestion))
  @ResponseMessage('Delete a quiz question')
  remove(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<any> {
    return this.quizQuestionsService.remove(quizTestId, id, user);
  }
}
