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
  Res,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/decorator/customize';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('attachments')
@ApiTags('Attachments')
export class AttachmentsController {
  @Post('uploads')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ResponseMessage('Upload multiple files')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      fileName: files.map((file) => file.filename),
    };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload single file' })
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

  @Get('view/:folderType/:fileName')
  @ApiOperation({ summary: 'View file' })
  @ResponseMessage('View file')
  async viewFile(
    @Param('folderType') folderType: string,
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'public', folderType, fileName);
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Not found file');
      }
      const fileStream = createReadStream(filePath);
      fileStream.pipe(response);
    } catch {
      throw new BadRequestException('Failed to view file');
    }
  }

  @Get('download/:folderType/:fileName')
  @ApiOperation({ summary: 'Download file' })
  @ResponseMessage('Download file')
  async downloadFile(
    @Param('folderType') folderType: string,
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'public', folderType, fileName);
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Not found file');
      }
      response.download(filePath);
      return { message: 'File downloaded successfully' };
    } catch {
      throw new BadRequestException('Failed to download file');
    }
  }

  @Delete(':folderType/:fileName')
  @ApiOperation({ summary: 'Delete file' })
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
