import { forwardRef, Module } from '@nestjs/common';
import { QuizAttemptsService } from './quiz-attempts.service';
import { QuizAttemptsController } from './quiz-attempts.controller';
import { QuizTestsModule } from '../quiz-tests/quiz-tests.module';
import { QuizAttempt, QuizAttemptSchema } from './schema/quiz-attempt.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizAttempt.name,
        schema: QuizAttemptSchema,
      },
    ]),
    forwardRef(() => QuizTestsModule),
  ],
  controllers: [QuizAttemptsController],
  providers: [QuizAttemptsService],
  exports: [QuizAttemptsService],
})
export class QuizAttemptsModule {}
