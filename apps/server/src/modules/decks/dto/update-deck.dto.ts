import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateDeckDto {
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsMongoId()
  parentId: string;
}
