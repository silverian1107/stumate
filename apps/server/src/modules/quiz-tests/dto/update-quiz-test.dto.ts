import { Transform } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateQuizTestDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
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
