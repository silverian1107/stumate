import { Controller, Get } from '@nestjs/common';
import { UserStatisticsService } from './user-statistics.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { User as UserModel, UserDocument } from '../users/schema/user.schema';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller('user-statistics')
export class UserStatisticsController {
  constructor(
    private readonly userStatisticsService: UserStatisticsService,
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async create() {
    const users = await this.userModel.find().select('-password');
    await Promise.all(
      users.map((user) =>
        this.userStatisticsService.createOrUpdate(user._id.toString()),
      ),
    );
  }

  @Public()
  @Get()
  @ResponseMessage('Fetch user statistic')
  async getUserStatistic(@User() user: IUser) {
    return await this.userStatisticsService.findOne(user);
  }
}
