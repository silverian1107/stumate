import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AbilityGuard } from 'src/casl/ability.guard';
import { CheckPolicies } from 'src/decorator/customize';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Collection } from './schema/collection.schema';

@ApiTags('Collections')
@Controller('collections')
@UseGuards(AbilityGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}
  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, Collection))
  @ApiOperation({ summary: 'Create a new collection' })
  @ApiBody({ type: CreateCollectionDto })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  async create(
    @Body() collectionData: CreateCollectionDto,
    @User() { _id }: IUser,
  ) {
    return this.collectionsService.create(collectionData, _id);
  }

  @Get('all')
  @CheckPolicies((ability) => ability.can(Action.READ, Collection))
  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({ status: 200 })
  async findAll(
    @Query('currentPage') currentPage = '1',
    @Query('pageSize') pageSize = '10',
    @Query() qs: string,
  ) {
    // TODO: Restricted to admin users only
    return this.collectionsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, Collection))
  @ApiOperation({ summary: 'Retrieve collections by user id' })
  @ApiResponse({ status: 200 })
  async findByOwnerId(
    @Query('currentPage') currentPage = 1,
    @Query('pageSize') pageSize = 10,
    @Query() qs: string,
    @User() user: IUser,
  ) {
    return this.collectionsService.findByOwnerId(
      user._id,
      +currentPage,
      +pageSize,
      qs,
    );
  }

  @Get('archived')
  @ApiOperation({ summary: 'Retrieve archived collections by user id' })
  @ApiResponse({ status: 200 })
  async findArchivedByOwnerId(
    @User() user: IUser,
    @Query('currentPage') currentPage = 1,
    @Query('pageSize') pageSize = 10,
    @Query() qs: string,
  ) {
    return this.collectionsService.findArchivedByOwnerId(
      user._id,
      +currentPage,
      +pageSize,
      qs,
    );
  }

  @Get(':collectionId')
  @CheckPolicies((ability) => ability.can(Action.READ, Collection))
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400 })
  async findById(
    @Param('collectionId') collectionId: string,
    @User() user: IUser,
  ) {
    return this.collectionsService.findById(collectionId, user._id);
  }

  @Patch(':collectionId')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, Collection))
  @ApiOperation({ summary: 'Update a collection by id' })
  @ApiBody({ type: UpdateCollectionDto })
  @ApiResponse({ status: 200, description: 'The updated collection.' })
  @ApiResponse({ status: 400 })
  async update(
    @Param('collectionId') collectionId: string,
    @Body() updateData: UpdateCollectionDto,
    @User() user: IUser,
  ) {
    return this.collectionsService.updateById(
      collectionId,
      user._id,
      updateData,
    );
  }

  // @Patch(':collectionId/archive')
  // @ApiOperation({ summary: 'Archive a collection by id' })
  // @ApiResponse({ status: 200, description: 'The archived collection.' })
  // @ApiResponse({ status: 404 })
  // async archive(
  //   @Param('collectionId') collectionId: string,
  //   @User() user: IUser,
  // ) {
  //   return this.collectionsService.archiveById(collectionId, user._id);
  // }

  // @Patch(':collectionId/restore')
  // @ApiOperation({ summary: 'Restore an archived collection by ID' })
  // @ApiResponse({ status: 200, description: 'The restored collection.' })
  // @ApiResponse({ status: 404 })
  // async restore(
  //   @Param('collectionId') collectionId: string,
  //   @User() user: IUser,
  // ) {
  //   return this.collectionsService.restoreById(collectionId, user._id);
  // }

  @Patch(':collectionId/delete')
  @CheckPolicies((ability) => ability.can(Action.DELETE, Collection))
  @ApiOperation({ summary: 'Delete a collection by ID' })
  @ApiResponse({ status: 200, description: 'The deleted collection.' })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  async delete(
    @Param('collectionId') collectionId: string,
    @User() user: IUser,
  ) {
    return this.collectionsService.deleteById(collectionId, user._id);
  }
}
