import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateFlashcardDto {
  @IsOptional()
  @IsString()
  front: string;

  @IsOptional()
  @IsString()
  back: string;

  @IsOptional()
  @IsMongoId()
  noteId: string;
}

export class UpdateMultipleFlashcardDto {
  @IsString()
  _id: string;

  @IsOptional()
  @IsString()
  front: string;

  @IsOptional()
  @IsString()
  back: string;
}
