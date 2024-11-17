import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxDate,
} from 'class-validator';
import { Gender } from './create-user.dto';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsDate()
  @MaxDate(new Date())
  @Transform(({ value }) => new Date(value))
  birthday: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender: string;

  @IsOptional()
  @IsString()
  avatarUrl: string;
}
