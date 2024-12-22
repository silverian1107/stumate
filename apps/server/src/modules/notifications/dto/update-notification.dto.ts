import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../schema/notification.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationDto {
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
