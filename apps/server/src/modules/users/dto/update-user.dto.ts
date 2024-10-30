import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxDate,
} from 'class-validator';
import { Gender } from './create-user.dto';
import { Type } from 'class-transformer';

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
  @IsEmail()
  email: string;

  @IsOptional()
  @IsDate()
  @MaxDate(new Date())
  @Type(() => Date)
  birthday: Date;

  @IsOptional()
  @IsEnum(Gender)
  gender: string;

  @IsOptional()
  @IsString()
  avatarUrl: string;
}
