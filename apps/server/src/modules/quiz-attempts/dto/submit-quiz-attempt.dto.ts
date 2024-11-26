import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Answers {
  @ApiProperty({
    description: 'Quiz question id',
    example: '1234567890',
  })
  @IsOptional()
  @IsMongoId()
  quizQuestionId: string;

  @ApiProperty({
    description: 'Answer',
    example: 'Paris',
  })
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
