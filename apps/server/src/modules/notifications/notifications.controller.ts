import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { SoftDeleteModel } from 'mongoose-delete';
import {
  User as UserModel,
  UserDocument,
  Role,
} from '../users/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../users/users.interface';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StatisticsService } from '../statistics/statistics.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly statisticsService: StatisticsService,
  ) {}

  @Post('admin/send')
  @Roles(Role.ADMIN)
  @ResponseMessage('Create general notifications for users')
  async sendAdminNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    try {
      const users = await this.userModel
        .find({ _id: { $in: createNotificationDto.userIds }, role: 'USER' })
        .select('-password');

      if (users.length === 0) {
        throw new NotFoundException('No users found');
      }

      await Promise.all(
        users.map((user) =>
          this.notificationsService.createNotification(
            user,
            createNotificationDto.type,
            createNotificationDto.title,
            createNotificationDto.body,
          ),
        ),
      );
    } catch {
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
    } catch {
      throw new InternalServerErrorException('Failed to send notification');
    }
  }

  @Get()
  @ResponseMessage('Get all notifications')
  async findAllByUser(@User() user: IUser) {
    return await this.notificationsService.findAllByUser(user);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ResponseMessage('Get all notifications')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.notificationsService.findAll(+currentPage, +pageSize, qs);
  }

  @Patch(':id/read')
  @ResponseMessage('Mark a notification as read')
  async markNotificationAsRead(@Param('id') id: string, @User() user: IUser) {
    const foundNotification = await this.notificationsService.findOne(id);
    if (foundNotification.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return await this.notificationsService.handleMarkNotificationAsRead(id);
  }

  @Patch('all-read')
  @ResponseMessage('Mark all notification as read')
  async markAllNotificationAsRead(@User() user: IUser) {
    return await this.notificationsService.handleMarkAllNotificationAsRead(
      user,
    );
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('Update a notification content')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return await this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete a notification')
  async remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    const foundNotification = await this.notificationsService.findOne(id);
    if (foundNotification.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return this.notificationsService.remove(id, user);
  }

  @Delete('all')
  @ResponseMessage('Delete a notification')
  async removeAll(@User() user: IUser): Promise<any> {
    return await this.notificationsService.removeAll(user);
  }
}
