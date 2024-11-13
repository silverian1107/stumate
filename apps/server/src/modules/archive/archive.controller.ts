import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
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

  @Get()
  findAll() {
    return this.archiveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.archiveService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.archiveService.remove(+id);
  }
}
