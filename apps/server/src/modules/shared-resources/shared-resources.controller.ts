import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { SharedResourcesService } from './shared-resources.service';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller(':resourceType/:resourceId')
export class SharedResourcesController {
  constructor(
    private readonly sharedResourcesService: SharedResourcesService,
  ) {}

  // @Post('publish')
  // @ResponseMessage('Publish a resource')
  // async publishResource(
  //   @Param('resourceType') resourceType: string,
  //   @Param('resourceId') resourceId: string,
  // ) {
  //   return this.sharedResourcesService.handlePublishResource(
  //     resourceType,
  //     resourceId,
  //   );
  // }

  // @Post('unpublish')
  // @ResponseMessage('Unpublish a resource')
  // async unpublishResource(
  //   @Param('resourceType') resourceType: string,
  //   @Param('resourceId') resourceId: string,
  // ) {
  //   return this.sharedResourcesService.handleUnpublishResource(
  //     resourceType,
  //     resourceId,
  //   );
  // }

  @Post('share')
  @ResponseMessage('Share resource with another user')
  async shareResourceWithUser(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
    @Body('usernameOrEmail') usernameOrEmail: string,
  ) {
    return this.sharedResourcesService.handleShareResourceWithUser(
      resourceType,
      resourceId,
      user,
      usernameOrEmail,
    );
  }

  @Delete('unshare')
  @ResponseMessage('Remove shared resource with another user')
  async removeSharedResourceWithUser(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @User() user: IUser,
    @Body('usernameOrEmail') usernameOrEmail: string,
  ) {
    return this.sharedResourcesService.handleRemoveSharedResourceWithUser(
      resourceType,
      resourceId,
      user,
      usernameOrEmail,
    );
  }
}
