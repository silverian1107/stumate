import { Module } from '@nestjs/common';
import { MylogsService } from './mylogs.service';
import { MylogsController } from './mylogs.controller';

@Module({
  controllers: [MylogsController],
  providers: [MylogsService],
})
export class MylogsModule {}
