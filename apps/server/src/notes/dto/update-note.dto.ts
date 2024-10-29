import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  Length,
  ValidateNested,
} from 'class-validator';

class UpdateNoteBodyDto {
  @IsNotEmpty()
  time: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => NoteBlockDto)
  blocks: NoteBlockDto[];
}

class NoteBlockDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  data: any;

  @IsOptional()
  tunes?: any;
}

export class UpdateNoteDto {
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateNoteBodyDto)
  body?: UpdateNoteBodyDto;
}
