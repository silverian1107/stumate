import { MyGateway } from 'src/gateway/gateway';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from './schema/notification.schema';
import { IUser } from '../users/users.interface';
import mongoose from 'mongoose';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import aqp from 'api-query-params';

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

  async findAllByUser(user: IUser) {
    return await this.notificationModel
      .find({ userId: user._id })
      .sort({ createdAt: -1 });
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    const totalItems = (await this.notificationModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.notificationModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
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
    return await this.notificationModel.find({
      userId: user._id,
      isRead: true,
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    return await this.notificationModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateNotificationDto,
      },
      { new: true },
    );
  }

  remove(id: string, user: IUser) {
    return this.notificationModel.delete({ _id: id }, user._id);
  }

  async removeAll(user: IUser) {
    return await this.notificationModel.delete({ userId: user._id }, user._id);
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid Notification ID');
    }
    const notification = await this.notificationModel.findOne({ _id: id });
    if (!notification) {
      throw new NotFoundException('Not found notification');
    }
    return notification;
  }
}
