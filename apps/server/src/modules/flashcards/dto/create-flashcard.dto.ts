import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFlashcardDto {
  @ApiProperty({
    description: 'The question of the flashcard',
    example: 'What is the capital of France?',
  })
  @IsNotEmpty()
  @IsString()
  front: string;

  @ApiProperty({
    description: 'The answer of the flashcard',
    example: 'Paris',
  })
  @IsNotEmpty()
  @IsString()
  back: string;

  @ApiProperty({
    description: 'The note id of the flashcard',
    example: '6512c620f09a0300015b0ae3',
  })
  @IsOptional()
  @IsMongoId()
  noteId: string;
}

export class MarkFlashcardDTO {
  @ApiProperty({
    description: 'The rating of the flashcard',
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  rating: number;

  @ApiProperty({
    description: 'The review date of the flashcard',
    example: 12345678,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  reviewDate?: number;
}
