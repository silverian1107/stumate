import { ApiProperty } from '@nestjs/swagger';
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
  MULTIPLE_CHOICE = 'multiple',
  SINGLE_CHOICE = 'single',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'short_answer',
}

export class CreateQuizQuestionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The question text',
    example: 'What is the capital of France?',
  })
  question: string;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  @IsString()
  @ApiProperty({
    description: 'The type of question',
    example: QuestionType.MULTIPLE_CHOICE,
  })
  questionType: string;

  @ValidateIf((o) => !o.answerText)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerOptions)
  @ApiProperty({
    description: 'The options for a multiple choice question',
    example: [
      { option: 'Paris', isCorrect: true },
      { option: 'London', isCorrect: false },
    ],
  })
  answerOptions: AnswerOptions[];

  @ValidateIf((o) => !o.answerOptions)
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The answer text for a short answer question',
    example: 'Paris',
  })
  answerText: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({
    description: 'The points for the question',
    example: 1,
  })
  point: number;
}
