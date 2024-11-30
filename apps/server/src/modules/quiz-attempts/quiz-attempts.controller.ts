import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { QuizAttemptsService } from './quiz-attempts.service';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { UserAnswersDto } from './dto/submit-quiz-attempt.dto';
import { Role } from '../users/schema/user.schema';

@Controller('quiz-tests/:quizTestId/quiz-attempts')
export class QuizAttemptsController {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  @Post('start')
  @Roles(Role.USER)
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
  @Roles(Role.USER)
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
  getByQuizTestId(
    @Param('quizTestId') quizTestId: string,
    @User() user: IUser,
  ) {
    return this.quizAttemptsService.findByQuizTestId(quizTestId, user);
  }

  @Get(':id')
  @ResponseMessage('Fetch quiz attempt by id')
  async findOne(
    @Param('quizTestId') quizTestId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    const foundQuizAttempt = await this.quizAttemptsService.findOne(
      quizTestId,
      id,
    );
    if (user.role === 'USER') {
      if (foundQuizAttempt.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundQuizAttempt;
  }

  @Patch(':id/save-progress')
  @Roles(Role.USER)
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
  // @ResponseMessage('Delete a quiz question')
  // remove(
  //   @Param('quizTestId') quizTestId: string,
  //   @Param('id') id: string,
  //   @User() user: IUser,
  // ): Promise<any> {
  //   return this.quizAttemptsService.remove(quizTestId, id, user);
  // }
}
