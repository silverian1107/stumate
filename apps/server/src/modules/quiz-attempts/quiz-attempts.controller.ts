import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizAttemptsService } from './quiz-attempts.service';
import { CheckPolicies, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { UserAnswersDto } from './dto/submit-quiz-attempt.dto';
import { AbilityGuard } from 'src/casl/ability.guard';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { QuizAttempt } from './schema/quiz-attempt.schema';
import { QuizTest } from '../quiz-tests/schema/quiz-test.schema';

@Controller('quiz-tests/:quizTestId/quiz-attempts')
@UseGuards(AbilityGuard)
export class QuizAttemptsController {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  @Post('start')
  @ResponseMessage('Send request to start a quiz')
  @CheckPolicies((ability) => ability.can(Action.STUDY, QuizTest))
  async startQuiz(
    @Param('quizTestId') quizTestId: string,
    @User() user: IUser,
  ) {
    const newQuizAttempt =
      await this.quizAttemptsService.handleStartQuizAttempt(quizTestId, user);
    return newQuizAttempt;
  }

  @Post(':id/submit')
  @CheckPolicies((ability) => ability.can(Action.STUDY, QuizTest))
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
  @CheckPolicies((ability) => ability.can(Action.READ, QuizAttempt))
  @ResponseMessage('Get quiz attempt by user')
  getByUserAndQuizTestId(
    @Param('quizTestId') quizTestId: string,
    @User() user: IUser,
  ) {
    return this.quizAttemptsService.findByUserAndQuizTestId(quizTestId, user);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, QuizAttempt))
  @ResponseMessage('Fetch list quiz attempt with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.quizAttemptsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, QuizAttempt))
  @ResponseMessage('Fetch quiz attempt by id')
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
  @CheckPolicies((ability) => ability.can(Action.UPDATE, QuizAttempt))
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

  // @Delete(':id')
  // @CheckPolicies((ability) => ability.can(Action.DELETE, QuizAttempt))
  // @ResponseMessage('Delete a quiz question')
  // remove(
  //   @Param('quizTestId') quizTestId: string,
  //   @Param('id') id: string,
  //   @User() user: IUser,
  // ): Promise<any> {
  //   return this.quizAttemptsService.remove(quizTestId, id, user);
  // }
}
