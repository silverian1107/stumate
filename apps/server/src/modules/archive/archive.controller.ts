import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller(':resourceType')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Post(':resourceId/archive')
  @ResponseMessage('Archive a resource')
  async archiveResource(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
  ) {
    return await this.archiveService.handleArchiveResource(
      resourceType,
      resourceId,
    );
  }

  @Post(':resourceId/restore')
  @ResponseMessage('Restore a resource')
  async restoreResource(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
  ) {
    return await this.archiveService.handleRestoreResource(
      resourceType,
      resourceId,
    );
  }

  @Get('archived-resources')
  @ResponseMessage('Fetch list archived resources with pagination')
  findAll(
    @User() user: IUser,
    @Param('resourceType') resourceType: string,
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.archiveService.findAll(
      user,
      resourceType,
      +currentPage,
      +pageSize,
      qs,
    );
  }

  @Get(':resourceType/archived-resource')
  @ResponseMessage('Fetch archived resources by id')
  async findOne(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
  ) {
    return await this.archiveService.findOne(resourceType, resourceId);
  }
}
