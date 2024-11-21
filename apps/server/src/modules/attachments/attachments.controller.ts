import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  UploadedFiles,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/customize';
import * as path from 'path';
import * as fs from 'fs';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Post('uploads')
  @ResponseMessage('Upload multiple files')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      fileName: files.map((file) => file.filename),
    };
  }

  @Post('upload')
  @ResponseMessage('Upload single file')
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image/,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return {
      fileName: file.filename,
    };
  }

  @Get()
  findAll() {
    return this.attachmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentsService.findOne(+id);
  }

  @Delete(':folderType/:fileName')
  @ResponseMessage('Delete single file')
  async deleteFile(
    @Param('folderType') folderType: string,
    @Param('fileName') fileName: string,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'public', folderType, fileName);
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Not found file');
      }
      await fs.promises.unlink(filePath);
      return { message: 'File deleted successfully' };
    } catch {
      throw new BadRequestException('Fail to delete file');
    }
  }
}
