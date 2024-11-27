import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SharedResourcesService } from './shared-resources.service';
import { CheckPolicies, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { AbilityGuard } from 'src/casl/ability.guard';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Note } from '../notes/schema/note.schema';
import { Deck } from '../decks/schema/deck.schema';
import { QuizTest } from '../quiz-tests/schema/quiz-test.schema';

@Controller(':resourceType')
@UseGuards(AbilityGuard)
export class SharedResourcesController {
  constructor(
    private readonly sharedResourcesService: SharedResourcesService,
  ) {}

  @Post(':resourceId/share')
  @CheckPolicies(
    (ability) =>
      ability.can(Action.SHARE, Note) ||
      ability.can(Action.SHARE, Deck) ||
      ability.can(Action.SHARE, QuizTest),
  )
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

  @Post(':resourceId/clone')
  @CheckPolicies(
    (ability) =>
      ability.can(Action.READ, Note) ||
      ability.can(Action.READ, Deck) ||
      ability.can(Action.READ, QuizTest),
  )
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

  @Post(':resourceId/unshare')
  @CheckPolicies(
    (ability) =>
      ability.can(Action.SHARE, Note) ||
      ability.can(Action.SHARE, Deck) ||
      ability.can(Action.SHARE, QuizTest),
  )
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
  @CheckPolicies(
    (ability) =>
      ability.can(Action.READ, Note) ||
      ability.can(Action.READ, Deck) ||
      ability.can(Action.READ, QuizTest),
  )
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
  @CheckPolicies(
    (ability) =>
      ability.can(Action.READ, Note) ||
      ability.can(Action.READ, Deck) ||
      ability.can(Action.READ, QuizTest),
  )
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
  @CheckPolicies(
    (ability) =>
      ability.can(Action.READ, Note) ||
      ability.can(Action.READ, Deck) ||
      ability.can(Action.READ, QuizTest),
  )
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
  @CheckPolicies(
    (ability) =>
      ability.can(Action.READ, Note) ||
      ability.can(Action.READ, Deck) ||
      ability.can(Action.READ, QuizTest),
  )
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
