import { Body, Controller, ForbiddenException, Get, Param, Post, Query } from '@nestjs/common';
import { SharedResourcesService } from './shared-resources.service';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Role } from '../users/schema/user.schema';

@Controller(':resourceType')
export class SharedResourcesController {
  constructor(
    private readonly sharedResourcesService: SharedResourcesService,
  ) {}

  @Post(':resourceId/share')
  @Roles(Role.USER)
  @ResponseMessage('Share resource with another user')
  async shareResourceWithUser(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
    @Body('usernameOrEmail') usernameOrEmail: string,
  ) {
    return await this.sharedResourcesService.handleShareResourceWithUser(
      resourceType,
      resourceId,
      user,
      usernameOrEmail,
    );
  }

  @Post(':resourceId/unshare')
  @Roles(Role.USER)
  @ResponseMessage('Remove shared resource with another user')
  async removeSharedResourceWithUser(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
    @Body('usernameOrEmail') usernameOrEmail: string,
  ) {
    return await this.sharedResourcesService.handleRemoveSharedResourceWithUser(
      resourceType,
      resourceId,
      user,
      usernameOrEmail,
    );
  }

  @Post(':resourceId/clone')
  @Roles(Role.USER)
  @ResponseMessage('Clone resource with another user')
  async cloneResource(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
  ) {
    return await this.sharedResourcesService.handleCloneResource(
      resourceType,
      resourceId,
      user,
    );
  }

  @Get('shared-resources')
  @Roles(Role.USER)
  @ResponseMessage('Get all shared resources')
  async findAllSharedResources(
    @User() user: IUser,
    @Param('resourceType') resourceType: string,
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return await this.sharedResourcesService.findAllSharedResources(
      user,
      resourceType,
      +currentPage,
      +pageSize,
      qs,
    );
  }

  @Get('cloned-resources')
  @Roles(Role.USER)
  @ResponseMessage('Get all cloned resources')
  async findAllClonedResources(
    @User() user: IUser,
    @Param('resourceType') resourceType: string,
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return await this.sharedResourcesService.findAllClonedResources(
      user,
      resourceType,
      +currentPage,
      +pageSize,
      qs,
    );
  }

  @Get(':resourceId/shared-resource')
  @Roles(Role.USER)
  @ResponseMessage('Fetch shared resource by id')
  async findSharedResource(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
  ) {
    return await this.sharedResourcesService.findSharedResource(
      resourceType,
      resourceId,
      user,
    );
  }

  @Get(':resourceId/cloned-resource')
  @Roles(Role.USER)
  @ResponseMessage('Fetch cloned resource by id')
  async findClonedResource(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
  ) {
    return await this.sharedResourcesService.findClonedResource(
      resourceType,
      resourceId,
      user,
    );
  }
}
