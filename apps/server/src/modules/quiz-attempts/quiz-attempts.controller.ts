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
import { QuizAttemptsService } from './quiz-attempts.service';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { UserAnswersDto } from './dto/submit-quiz-attempt.dto';

@Controller('quiz-tests/:quizTestId/quiz-attempts')
export class QuizAttemptsController {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  @Post('start')
  @ResponseMessage('Send request to start a quiz')
  async startQuiz(
    @Param('quizTestId') quizTestId: string,
    @User() user: IUser,
  ) {
    const newQuizAttempt =
      await this.quizAttemptsService.handleStartQuizAttempt(quizTestId, user);
    return newQuizAttempt;
  }

  @Post(':id/submit')
  @ResponseMessage('Send request to submit a quiz')
  async submitQuiz(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @Body() userAnswersDto: UserAnswersDto,
    @User() user: IUser,
  ) {
    return await this.quizAttemptsService.handleSubmitQuizAttempt(
      quizTestId,
      id,
      userAnswersDto,
      user,
    );
  }

  @Post('all')
  @ResponseMessage('Get quiz attempt by user')
  getByUserAndQuizTestId(
    @Param('quizTestId') quizTestId: string,
    @User() user: IUser,
  ) {
    return this.quizAttemptsService.findByUserAndQuizTestId(quizTestId, user);
  }

  @Get()
  @ResponseMessage('Fetch list quiz attempt with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.quizAttemptsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch quiz question by id')
  async findOne(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
  ) {
    const foundQuizAttempt = await this.quizAttemptsService.findOne(
      quizTestId,
      id,
    );
    return foundQuizAttempt;
  }

  @Patch(':id/save-progress')
  @ResponseMessage('Save the progress of a quiz')
  async saveQuizAttempt(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @Body() userAnswersDto: UserAnswersDto,
    @User() user: IUser,
  ) {
    const updateQuizAttempt =
      await this.quizAttemptsService.handleSaveQuizAttempt(
        quizTestId,
        id,
        userAnswersDto,
        user,
      );
    return {
      message: 'The quiz progress was saved successfully',
      updateQuizAttempt,
    };
  }

  @Delete(':id')
  @ResponseMessage('Delete a quiz question')
  remove(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ): Promise<any> {
    return this.quizAttemptsService.remove(quizTestId, id, user);
  }
}
