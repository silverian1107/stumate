import { Controller, Get, Post, Param, Query, ForbiddenException } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Archive')
@Controller(':resourceType')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @ApiOperation({ summary: 'Archive a resource' })
  @Post(':resourceId/archive')
  @ResponseMessage('Archive a resource')
  async archiveResource(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
  ) {
    const resource = await this.archiveService.findOne(
      resourceType,
      resourceId,
    );
    const ownerId = resource.ownerId || resource.userId;
    if (user.role === 'USER') {
      if (ownerId.toString() === user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return await this.archiveService.handleArchiveResource(
      resourceType,
      resourceId,
    );
  }

  @ApiOperation({ summary: 'Restore a resource' })
  @Post(':resourceId/restore')
  @ResponseMessage('Restore a resource')
  async restoreResource(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
  ) {
    const resource = await this.archiveService.findOne(
      resourceType,
      resourceId,
      true,
    );
    const ownerId = resource.ownerId || resource.userId;
    if (user.role === 'USER') {
      if (ownerId.toString() === user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return await this.archiveService.handleRestoreResource(
      resourceType,
      resourceId,
    );
  }

  @ApiOperation({ summary: 'Fetch list archived resources with pagination' })
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

  @ApiOperation({ summary: 'Fetch archived resources by id' })
  @Get(':resourceType/archived-resource')
  @ResponseMessage('Fetch archived resources by id')
  async findOne(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
  ) {
    const resource = await this.archiveService.findOne(
      resourceType,
      resourceId,
      true,
    );
    const ownerId = resource.ownerId || resource.userId;
    if (user.role === 'USER') {
      if (ownerId.toString() === user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return resource;
  }
}
