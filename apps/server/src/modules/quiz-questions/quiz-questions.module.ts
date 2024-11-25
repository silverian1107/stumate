import { forwardRef, Module } from '@nestjs/common';
import { QuizQuestionsService } from './quiz-questions.service';
import { QuizQuestionsController } from './quiz-questions.controller';
import {
  QuizQuestion,
  QuizQuestionSchema,
} from './schema/quiz-question.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizTestsModule } from '../quiz-tests/quiz-tests.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizQuestion.name,
        schema: QuizQuestionSchema,
      },
    ]),
    forwardRef(() => QuizTestsModule),
    CaslModule,
  ],
  controllers: [QuizQuestionsController],
  providers: [QuizQuestionsService],
  exports: [QuizQuestionsService],
})
export class QuizQuestionsModule {}
