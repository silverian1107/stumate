import { Controller, Get, Param } from '@nestjs/common';
import { QuizAttemptsService } from './quiz-attempts.service';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { Role } from '../users/schema/user.schema';
import { IUser } from '../users/users.interface';

@Controller('quiz-attempts')
export class QuizAttemptsWithoutQuizIdController {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  @Get(':id/data')
  @Roles(Role.USER)
  @ResponseMessage('Fetch quiz attempt data by id')
  async getAttemptData(@Param('id') id: string, @User() user: IUser) {
    return this.quizAttemptsService.getAttemptData(id, user);
  }
}
