import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSummaryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The content of the summary',
    example: 'React is a library not a framework',
  })
  content: string;
}
