import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { SoftDeleteModel } from 'mongoose-delete';
import { User as UserModel, UserDocument } from '../users/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../users/users.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StatisticsService } from '../statistics/statistics.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly statisticsService: StatisticsService,
  ) {}

  @Post('admin/send')
  @ResponseMessage('Create general notifications for users')
  async sendAdminNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    try {
      const users = await this.userModel
        .find({ role: 'USER' })
        .select('-password');
      await Promise.all(
        users.map(
          async (user) =>
            await this.notificationsService.createNotification(
              user,
              createNotificationDto.type,
              createNotificationDto.title,
              createNotificationDto.body,
            ),
        ),
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to create notifications');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDeadlineReminder() {
    try {
      const users = await this.userModel
        .find({ role: 'USER' })
        .select('-password');
      await Promise.all(
        users.map(async (user) => {
          const cardsDueToday =
            await this.statisticsService.getFlashcardsDueTodayCount(
              user._id.toString(),
            );
          if (cardsDueToday > 0) {
            await this.notificationsService.sendWarningNotification(
              user,
              `Upcoming Deadline`,
              `You have ${cardsDueToday} cards due today. Make sure to review them!`,
            );
          }
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to send notification');
    }
  }

  @Get()
  @ResponseMessage('Get all notifications')
  async findAll(@User() user: IUser) {
    return await this.notificationsService.findAll(user);
  }

  @Patch(':id/read')
  @ResponseMessage('Mark a notification as read')
  async markNotificationAsRead(@Param('id') id: string) {
    return await this.notificationsService.handleMarkNotificationAsRead(id);
  }

  @Patch(':id/all-read')
  @ResponseMessage('Mark all notification as read')
  async markAllNotificationAsRead(@User() user: IUser) {
    return await this.notificationsService.handleMarkAllNotificationAsRead(
      user,
    );
  }

  @Delete(':id')
  @ResponseMessage('Delete a notification')
  remove(@Param('id') id: string): Promise<any> {
    return this.notificationsService.remove(id);
  }

  @Delete('all')
  @ResponseMessage('Delete a notification')
  async removeAll(@User() user: IUser): Promise<any> {
    return await this.notificationsService.removeAll(user);
  }
}
