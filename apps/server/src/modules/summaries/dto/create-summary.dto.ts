import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSummaryDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
