import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuizTestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Quiz name',
    example: 'My Quiz',
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Quiz description',
    example: 'This is my quiz',
  })
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({
    description: 'The number of questions',
    example: 30,
  })
  numberOfQuestion: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @ApiProperty({
    description: 'The time limit for the quiz in minutes',
    example: 30,
  })
  duration: number;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    description: 'The note id',
    example: '6512c620f09a0300015b0ae3',
  })
  noteId: string;
}
