import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { ResponseMessage } from 'src/decorator/customize';

@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Post(':resourceType/archive/:resourceId')
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

  @Post(':resourceType/restore/:resourceId')
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

  @Get(':resourceType')
  @ResponseMessage('Fetch list archived resources with pagination')
  findAll(
    @Param('resourceType') resourceType: string,
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.archiveService.findAll(
      resourceType,
      +currentPage,
      +pageSize,
      qs,
    );
  }

  @Get(':resourceType/:resourceId')
  @ResponseMessage('Fetch archived resources by id')
  async findOne(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
  ) {
    return await this.archiveService.findOne(resourceType, resourceId);
  }
}
