import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateDeckDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
