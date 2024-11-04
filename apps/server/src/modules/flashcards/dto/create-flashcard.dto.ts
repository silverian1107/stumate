import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
