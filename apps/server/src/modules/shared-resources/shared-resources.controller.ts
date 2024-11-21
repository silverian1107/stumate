import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SharedResourcesService } from './shared-resources.service';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller(':resourceType')
export class SharedResourcesController {
  constructor(
    private readonly sharedResourcesService: SharedResourcesService,
  ) {}

  @Post(':resourceId/share')
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

  @Get('shared-resources')
  @ResponseMessage('Get all shared resources')
  async findAll(
    @User() user: IUser,
    @Param('resourceType') resourceType: string,
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return await this.sharedResourcesService.findAll(
      user,
      resourceType,
      +currentPage,
      +pageSize,
      qs,
    );
  }
}
