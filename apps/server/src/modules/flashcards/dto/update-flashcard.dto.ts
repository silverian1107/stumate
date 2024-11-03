import { IsOptional, IsString } from 'class-validator';

export class UpdateFlashcardDto {
  @IsOptional()
  @IsString()
  front: string;

  @IsOptional()
  @IsString()
  back: string;
}
