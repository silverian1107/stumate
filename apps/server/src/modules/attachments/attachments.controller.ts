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
} from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/customize';
// import * as fs from 'fs';
// import * as path from 'path';

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

  // @Public()
  // @ResponseMessage('Delete single file')
  // @Delete(':fileName')
  // async deleteFile(@Param('fileName') fileName: string) {
  //   try {
  //     const rootPath = process.cwd();
  //     const filePath = path.join(rootPath, 'public/attachments', fileName);
  //     await fs.promises.unlink(filePath);
  //     return { message: 'File deleted successfully.' };
  //   } catch (err) {
  //     console.error('Error deleting file:', err);
  //     throw new Error('Failed to delete file');
  //   }
  // }
}
