import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxDate,
} from 'class-validator';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'The password should be at least 8 characters long and contain at least 1 uppercase character, 1 lowercase, 1 number, 1 special character.',
    },
  )
  password: string;

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

export class CodeAutoDto {
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsNotEmpty()
  @IsString()
  codeId: string;
}

export class ChangePasswordAutoDto {
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  codeId: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'The password should be at least 8 characters long and contain at least 1 uppercase character, 1 lowercase, 1 number, 1 special character.',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
