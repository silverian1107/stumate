import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class NoteBlockDto {
  @ApiProperty({
    description: 'Id of a note block',
    example: '671fc56910a44757a43d86b2',
    type: String,
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Type of a note block',
    example: 'paragraph',
    type: String,
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Data of a note block',
    type: Object,
  })
  @IsNotEmpty()
  data: any;

  @ApiProperty({
    description: 'Tunes of a note block',
    type: Object,
  })
  @IsOptional()
  tunes?: any;
}

class UpdateNoteBodyDto {
  @ApiProperty({
    description: 'Time of the note',
    example: 12345678,
    type: Number,
  })
  @IsNotEmpty()
  time: number;

  @ApiProperty({
    description: 'Blocks of the note',
    type: [NoteBlockDto],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => NoteBlockDto)
  blocks: NoteBlockDto[];
}

export class UpdateNoteDto {
  @ApiProperty({
    description: 'Name of the note',
    required: false,
    example: 'My note',
    type: String,
  })
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @ApiProperty({
    description: 'Body of the note',
    required: false,
    type: UpdateNoteBodyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateNoteBodyDto)
  body?: UpdateNoteBodyDto;

  @ApiProperty({
    description: 'Attachment of the note',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachment?: string[];
}
