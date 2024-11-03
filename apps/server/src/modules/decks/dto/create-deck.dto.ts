import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateDeckDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
