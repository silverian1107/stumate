import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({
    description: 'Owner of the collection id',
    example: '6512c620f09a0300015b0ae3',
  })
  @IsString()
  ownerId: string;

  @ApiProperty({
    description: 'The parent of the collection id',
    example: '6512c620f09a0300015b0ae3',
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    description: 'Name of the collection',
    example: 'My Collection',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Optional description of the collection',
    example: 'This is a sample collection.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
