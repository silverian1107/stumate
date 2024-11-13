import { Module } from '@nestjs/common';
import { QuizTestsService } from './quiz-tests.service';
import { QuizTestsController } from './quiz-tests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizTest, QuizTestSchema } from './schema/quiz-test.schema';
import {
  QuizQuestion,
  QuizQuestionSchema,
} from '../quiz-questions/schema/quiz-question.schema';
import {
  QuizAttempt,
  QuizAttemptSchema,
} from '../quiz-attempts/schema/quiz-attempt.schema';
import { UserStatisticsModule } from '../user-statistics/user-statistics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizTest.name,
        schema: QuizTestSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: QuizQuestion.name,
        schema: QuizQuestionSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: QuizAttempt.name,
        schema: QuizAttemptSchema,
      },
    ]),
    UserStatisticsModule,
  ],
  controllers: [QuizTestsController],
  providers: [QuizTestsService],
  exports: [QuizTestsService],
})
export class QuizTestsModule {}
