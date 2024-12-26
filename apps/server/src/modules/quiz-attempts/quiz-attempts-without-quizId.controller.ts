import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { QuizAttemptsService } from './quiz-attempts.service';
import { CustomAttemptService } from './custom-quiz-attempts.service';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { Role } from '../users/schema/user.schema';
import { IUser } from '../users/users.interface';
import { CreateCustomAttemptDto } from './dto/custom-attempt.create';

@Controller('quiz-attempts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuizAttemptsWithoutQuizIdController {
  constructor(
    private readonly quizAttemptsService: QuizAttemptsService,
    private readonly customAttemptService: CustomAttemptService,
  ) {}

  @Get(':id/data')
  @Roles(Role.USER)
  @ResponseMessage('Fetch quiz attempt data by id')
  async getAttemptData(@Param('id') id: string, @User() user: IUser) {
    return this.quizAttemptsService.getAttemptData(id, user);
  }

  @Post('custom')
  @Roles(Role.USER)
  @ResponseMessage('Create a custom quiz attempt')
  async createCustomAttempt(
    @Body() createCustomAttemptDto: CreateCustomAttemptDto,
    @User() user: IUser,
  ) {
    return this.customAttemptService.createCustomAttempt(
      user,
      createCustomAttemptDto.selectedQuizzes,
      createCustomAttemptDto.duration,
      createCustomAttemptDto.numberOfQuestions,
    );
  }
}
