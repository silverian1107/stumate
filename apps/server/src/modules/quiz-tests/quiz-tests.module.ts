import { forwardRef, Module } from '@nestjs/common';
import { QuizTestsService } from './quiz-tests.service';
import { QuizTestsController } from './quiz-tests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizTest, QuizTestSchema } from './schema/quiz-test.schema';
import { QuizQuestionsModule } from '../quiz-questions/quiz-questions.module';
import { QuizAttemptsModule } from '../quiz-attempts/quiz-attempts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizTest.name,
        schema: QuizTestSchema,
      },
    ]),
    forwardRef(() => QuizQuestionsModule),
    forwardRef(() => QuizAttemptsModule),
  ],
  controllers: [QuizTestsController],
  providers: [QuizTestsService],
  exports: [QuizTestsService],
})
export class QuizTestsModule {}
