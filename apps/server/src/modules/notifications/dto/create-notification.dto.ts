import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from '../schema/notification.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification userId',
    required: false,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  @IsOptional()
  userIds: string[];

  @ApiProperty({
    description: 'Notification type',
    example: 'INFO',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Notification body',
    example: 'This is a notification',
  })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Notification type',
    example: 'INFO',
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type: NotificationType;
}
