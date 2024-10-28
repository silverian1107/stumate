import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Owner of the note id',
    example: '6512c620f09a0300015b0ae3',
  })
  @IsString()
  ownerId: string;

  @ApiProperty({
    description: 'The parent of the note id',
    example: '6512c620f09a0300015b0ae3',
  })
  @IsString()
  @IsOptional()
  parentId: string;

  @ApiProperty({
    description: 'Name of the note',
    example: 'My note',
  })
  @IsString()
  @Length(1, 100)
  name: string;
}
