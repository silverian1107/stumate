import { PartialType } from '@nestjs/swagger';
import { CreateUserStatisticDto } from './create-user-statistic.dto';

export class UpdateUserStatisticDto extends PartialType(
  CreateUserStatisticDto,
) {}
