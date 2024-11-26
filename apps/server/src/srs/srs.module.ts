import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Srs, SrsSchema } from './schema/sr.entity';
import { SrsController } from './srs.controller';
import { SrsService } from './srs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Srs.name, schema: SrsSchema }])],
  controllers: [SrsController],
  providers: [SrsService],
})
export class SrsModule {}
