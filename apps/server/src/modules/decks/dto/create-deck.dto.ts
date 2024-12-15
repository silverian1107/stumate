import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateDeckDto {
  @IsOptional()
  @IsString()
  noteId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
