import { CreateCollectionDto } from './create-collection.dto';
import { PartialType, PickType } from '@nestjs/swagger';

export class UpdateCollectionDto extends PartialType(
  PickType(CreateCollectionDto, ['name', 'description']),
) {}
