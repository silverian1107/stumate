import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    CaslModule,
  ],
})
export class AttachmentsModule {}
