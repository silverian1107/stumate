import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { QuestionType } from './create-quiz-question.dto';

class AnswerOptions {
  @IsString()
  option: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class UpdateQuizQuestionDto {
  @IsString()
  @IsOptional()
  _id: string;

  @IsOptional()
  @IsString()
  question: string;

  @IsOptional()
  @IsEnum(QuestionType)
  @IsString()
  questionType: string;

  @ValidateIf((o) => !o.answerText)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerOptions)
  answerOptions: AnswerOptions[];

  @ValidateIf((o) => !o.answerOptions)
  @IsOptional()
  @IsString()
  answerText: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  point: number;
}
