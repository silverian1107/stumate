import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import {
  User as UserModel,
  UserDocument,
  Role,
} from '../users/schema/user.schema';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async create() {
    try {
      const users = await this.userModel
        .find({ role: 'USER' })
        .select('-password');
      await Promise.all(
        users.map(
          async (user) =>
            await this.statisticsService.createOrUpdateUserStatistics(
              user._id.toString(),
            ),
        ),
      );
    } catch {
      throw new InternalServerErrorException(
        'Failed to create new user statistics',
      );
    }
  }

  @Get()
  @Roles(Role.USER)
  @ResponseMessage('Fetch user statistic')
  async getUserStatistic(@User() user: IUser) {
    return await this.statisticsService.createOrUpdateUserStatistics(user._id);
  }

  @Get('/admin')
  @Roles(Role.ADMIN)
  @ResponseMessage('Fetch admin statistic')
  async getAdminStatistic() {
    return await this.statisticsService.getAdminStatistics();
  }
}
