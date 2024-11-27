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
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  numberOfQuestion: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  duration: number;

  @IsOptional()
  @IsMongoId()
  noteId: string;
}
