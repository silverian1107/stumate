import { forwardRef, Module } from '@nestjs/common';
import { QuizAttemptsService } from './quiz-attempts.service';
import { QuizAttemptsController } from './quiz-attempts.controller';
import { QuizTestsModule } from '../quiz-tests/quiz-tests.module';
import { QuizAttempt, QuizAttemptSchema } from './schema/quiz-attempt.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizQuestionsModule } from '../quiz-questions/quiz-questions.module';
import { StatisticsModule } from '../statistics/statistics.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { QuizAttemptsWithoutQuizIdController } from './quiz-attempts-without-quizId.controller';
import { CustomAttemptService } from './custom-quiz-attempts.service';
import {
  CustomAttempt,
  CustomAttemptSchema,
} from './schema/custom-attempt.schema';
import {
  QuizQuestion,
  QuizQuestionSchema,
} from '../quiz-questions/schema/quiz-question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizAttempt.name,
        schema: QuizAttemptSchema,
      },
      {
        name: CustomAttempt.name,
        schema: CustomAttemptSchema,
      },
      {
        name: QuizQuestion.name,
        schema: QuizQuestionSchema,
      },
    ]),
    forwardRef(() => QuizTestsModule),
    forwardRef(() => QuizQuestionsModule),
    StatisticsModule,
    NotificationsModule,
  ],
  controllers: [QuizAttemptsController, QuizAttemptsWithoutQuizIdController],
  providers: [QuizAttemptsService, CustomAttemptService],
  exports: [QuizAttemptsService],
})
export class QuizAttemptsModule {}
