import { IsOptional, IsString } from 'class-validator';

export class UpdateSummaryDto {
  @IsOptional()
  @IsString()
  content: string;
}
