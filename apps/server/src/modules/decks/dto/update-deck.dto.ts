import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateDeckDto {
  @ApiProperty({
    description: 'Name of the deck',
    example: 'My Deck',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Optional description of the deck',
    example: 'This is a sample deck Description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
}
