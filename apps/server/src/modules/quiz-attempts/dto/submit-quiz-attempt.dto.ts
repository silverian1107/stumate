import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Answers {
  @IsOptional()
  @IsMongoId()
  quizQuestionId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  answer: string[];
}

export class UserAnswersDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answers)
  answers: Answers[];
}
