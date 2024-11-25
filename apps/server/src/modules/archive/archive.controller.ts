import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { CheckPolicies, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { AbilityGuard } from 'src/casl/ability.guard';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Collection } from '../collections/schema/collection.schema';
import { Note } from '../notes/schema/note.schema';
import { Deck } from '../decks/schema/deck.schema';
import { QuizTest } from '../quiz-tests/schema/quiz-test.schema';

@Controller(':resourceType')
@UseGuards(AbilityGuard)
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Post(':resourceId/archive')
  @CheckPolicies(
    (ability) =>
      ability.can(Action.ARCHIVE, Collection) ||
      ability.can(Action.ARCHIVE, Note) ||
      ability.can(Action.ARCHIVE, Deck) ||
      ability.can(Action.ARCHIVE, QuizTest),
  )
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
  @CheckPolicies(
    (ability) =>
      ability.can(Action.ARCHIVE, Collection) ||
      ability.can(Action.ARCHIVE, Note) ||
      ability.can(Action.ARCHIVE, Deck) ||
      ability.can(Action.ARCHIVE, QuizTest),
  )
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
  @CheckPolicies(
    (ability) =>
      ability.can(Action.READ, Collection) ||
      ability.can(Action.READ, Note) ||
      ability.can(Action.READ, Deck) ||
      ability.can(Action.READ, QuizTest),
  )
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
  @CheckPolicies(
    (ability) =>
      ability.can(Action.READ, Collection) ||
      ability.can(Action.READ, Note) ||
      ability.can(Action.READ, Deck) ||
      ability.can(Action.READ, QuizTest),
  )
  @ResponseMessage('Fetch archived resources by id')
  async findOne(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
  ) {
    return await this.archiveService.findOne(resourceType, resourceId);
  }
}
