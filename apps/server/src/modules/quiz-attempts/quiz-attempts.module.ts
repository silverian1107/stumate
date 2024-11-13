import { forwardRef, Module } from '@nestjs/common';
import { QuizAttemptsService } from './quiz-attempts.service';
import { QuizAttemptsController } from './quiz-attempts.controller';
import { QuizTestsModule } from '../quiz-tests/quiz-tests.module';
import { QuizAttempt, QuizAttemptSchema } from './schema/quiz-attempt.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizQuestionsModule } from '../quiz-questions/quiz-questions.module';
import { UserStatisticsModule } from '../user-statistics/user-statistics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizAttempt.name,
        schema: QuizAttemptSchema,
      },
    ]),
    forwardRef(() => QuizTestsModule),
    forwardRef(() => QuizQuestionsModule),
    UserStatisticsModule,
  ],
  controllers: [QuizAttemptsController],
  providers: [QuizAttemptsService],
  exports: [QuizAttemptsService],
})
export class QuizAttemptsModule {}
