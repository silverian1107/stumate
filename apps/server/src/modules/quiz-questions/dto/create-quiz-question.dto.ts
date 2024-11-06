import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class AnswerOptions {
  @IsString()
  option: string;

  @IsBoolean()
  isCorrect: boolean;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

export class CreateQuizQuestionDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  point: number;
}
