import { PartialType } from '@nestjs/swagger';
import { CreateSrDto } from './create-sr.dto';

export class UpdateSrDto extends PartialType(CreateSrDto) {}
