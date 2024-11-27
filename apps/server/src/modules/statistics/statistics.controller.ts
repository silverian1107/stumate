import {
  Controller,
  Get,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { User as UserModel, UserDocument } from '../users/schema/user.schema';
import { CheckPolicies, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { AbilityGuard } from 'src/casl/ability.guard';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { UserStatistic } from './schema/user-statistic.schema';

@Controller('statistics')
@UseGuards(AbilityGuard)
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
  @CheckPolicies((ability) => ability.can(Action.READ, UserStatistic))
  @ResponseMessage('Fetch user statistic')
  async getUserStatistic(@User() user: IUser) {
    return await this.statisticsService.findOne(user);
  }
}
