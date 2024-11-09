import { Injectable } from '@nestjs/common';
import { CreateUserStatisticDto } from './dto/create-user-statistic.dto';
import { UpdateUserStatisticDto } from './dto/update-user-statistic.dto';

@Injectable()
export class UserStatisticsService {
  create(createUserStatisticDto: CreateUserStatisticDto) {
    return createUserStatisticDto;
  }

  findAll() {
    return `This action returns all userStatistics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userStatistic`;
  }

  update(id: number, updateUserStatisticDto: UpdateUserStatisticDto) {
    return updateUserStatisticDto;
  }

  remove(id: number) {
    return `This action removes a #${id} userStatistic`;
  }
}
