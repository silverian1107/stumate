import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Answers {
  @IsNotEmpty()
  @IsMongoId()
  quizQuestionId: string;

  @IsNotEmpty()
  @IsString()
  answer: string;
}

export class CreateQuizAttemptDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  totalQuestions: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answers)
  answers: Answers[];

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  duration: number;
}
