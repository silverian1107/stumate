import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationSchema } from './schema/notification.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GatewayModule } from 'src/gateway/gateway.module';
import { UserSchema } from '../users/schema/user.schema';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Notification',
        schema: NotificationSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
    GatewayModule,
    StatisticsModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
