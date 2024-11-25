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
  UseGuards,
  Res,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CheckPolicies, ResponseMessage } from 'src/decorator/customize';
import * as path from 'path';
import * as fs from 'fs';
import { AbilityGuard } from 'src/casl/ability.guard';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Note } from '../notes/schema/note.schema';
import { User } from '../users/schema/user.schema';
import { Response } from 'express';

@Controller('attachments')
@UseGuards(AbilityGuard)
export class AttachmentsController {
  @Post('uploads')
  @CheckPolicies(
    (ability) =>
      ability.can(Action.CREATE, Note) || ability.can(Action.UPDATE, Note),
  )
  @ResponseMessage('Upload multiple files')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      fileName: files.map((file) => file.filename),
    };
  }

  @Post('upload')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, User))
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
  @CheckPolicies(
    (ability) =>
      ability.can(Action.READ, Note) || ability.can(Action.READ, User),
  )
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
  @CheckPolicies(
    (ability) =>
      ability.can(Action.READ, Note) || ability.can(Action.READ, User),
  )
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
  @CheckPolicies((ability) => ability.can(Action.DELETE, Note))
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
