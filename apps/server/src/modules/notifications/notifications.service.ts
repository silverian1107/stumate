import { MyGateway } from 'src/gateway/gateway';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Notification, NotificationDocument, NotificationType } from './schema/notification.schema';
import { IUser } from '../users/users.interface';
import mongoose from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: SoftDeleteModel<NotificationDocument>,
    private readonly myGateway: MyGateway,
  ) {}

  async createNotification(
    user: any,
    type: NotificationType,
    title: string,
    body: string,
  ) {
    //Create a new notification
    const newNotification = await this.notificationModel.create({
      userId: user._id,
      role: user.role,
      type,
      title,
      body,
    });
    this.myGateway.sendNotification(newNotification);
    return newNotification;
  }

  async sendInfoNotification(user: any, title: string, body: string) {
    if (user.role === 'USER') {
      return await this.createNotification(
        user,
        NotificationType.INFO,
        title,
        body,
      );
    }
    return null;
  }

  async sendWarningNotification(user: any, title: string, body: string) {
    if (user.role === 'USER') {
      return await this.createNotification(
        user,
        NotificationType.WARNING,
        title,
        body,
      );
    }
    return null;
  }

  async sendSuccessNotification(user: any, title: string, body: string) {
    if (user.role === 'USER') {
      return await this.createNotification(
        user,
        NotificationType.SUCCESS,
        title,
        body,
      );
    }
    return null;
  }

  async findAll(user: IUser) {
    return await this.notificationModel
      .find({ userId: user._id })
      .sort({ createdAt: -1 });
  }

  async handleMarkNotificationAsRead(id: string) {
    return await this.notificationModel.findOneAndUpdate(
      { _id: id },
      { isRead: true },
      { new: true },
    );
  }

  async handleMarkAllNotificationAsRead(user: IUser) {
    await this.notificationModel.updateMany(
      { userId: user._id, isRead: false },
      { $set: { isRead: true } },
    );
    const updatedNotifications = await this.notificationModel.find({
      userId: user._id,
      isRead: true,
    });
    return updatedNotifications;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Notification ID');
    }
    const notification = await this.notificationModel.findOne({ _id: id });
    if (!notification) {
      throw new NotFoundException('Not found notification');
    }
    return this.notificationModel.delete({ _id: id });
  }

  async removeAll(user: IUser) {
    return await this.notificationModel.delete({ userId: user._id });
  }
}
