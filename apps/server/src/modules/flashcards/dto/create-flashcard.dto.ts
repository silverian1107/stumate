import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFlashcardDto {
  @IsNotEmpty()
  @IsString()
  front: string;

  @IsNotEmpty()
  @IsString()
  back: string;

  @IsOptional()
  @IsMongoId()
  noteId: string;
}

export class MarkFlashcardDTO {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  reviewDate?: number;
}
