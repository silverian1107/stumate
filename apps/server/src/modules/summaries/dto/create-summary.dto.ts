import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSummaryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The content of the summary',
    example: 'React is a library not a framework',
  })
  content: string;
}
