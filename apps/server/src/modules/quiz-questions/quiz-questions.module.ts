import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizTestsModule } from '../quiz-tests/quiz-tests.module';
import { QuizQuestionsController } from './quiz-questions.controller';
import { QuizQuestionsService } from './quiz-questions.service';
import {
  QuizQuestion,
  QuizQuestionSchema,
} from './schema/quiz-question.schema';
import { HttpModule } from '@nestjs/axios';
import { Note, NoteSchema } from '../notes/schema/note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuizQuestion.name,
        schema: QuizQuestionSchema,
      },
    ]),
    forwardRef(() => QuizTestsModule),
    MongooseModule.forFeature([
      {
        name: Note.name,
        schema: NoteSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [QuizQuestionsController],
  providers: [QuizQuestionsService],
  exports: [QuizQuestionsService],
})
export class QuizQuestionsModule {}
