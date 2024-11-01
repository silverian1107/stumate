import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new collection' })
  @ApiBody({ type: CreateCollectionDto })
  @ApiResponse({
    status: 201,
    description: 'The collection has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or validation error.',
  })
  async create(
    @Body() collectionData: CreateCollectionDto,
    @User() { _id }: IUser,
  ) {
    return this.collectionsService.create(collectionData, _id);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all collections' })
  @ApiQuery({
    name: 'currentPage',
    description: 'The current page number',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'The number of items per page',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'qs',
    description: 'Query string for sorting and filtering',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of collections.',
    isArray: true,
  })
  async findAll(
    @Query('currentPage') currentPage = '1',
    @Query('pageSize') pageSize = '10',
    @Query('qs') qs: string,
  ) {
    // TODO: Restricted to admin users only
    return this.collectionsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve collections by user id' })
  @ApiQuery({
    name: 'currentPage',
    description: 'The current page number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'The number of items per page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'qs',
    description: 'Query string for sorting and filtering',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of root-level collections.',
    isArray: true,
  })
  async findByOwnerId(
    @Query('currentPage') currentPage = 1,
    @Query('pageSize') pageSize = 10,
    @Query('qs') qs: string,
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
  @ApiQuery({
    name: 'currentPage',
    description: 'The current page number',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'The number of items per page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'qs',
    description: 'Query string for sorting and filtering',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of archived collections.',
    isArray: true,
  })
  async findArchivedByOwnerId(
    @User() user: IUser,
    @Query('currentPage') currentPage = 1,
    @Query('pageSize') pageSize = 10,
    @Query('qs') qs: string,
  ) {
    return this.collectionsService.findArchivedByOwnerId(
      user._id,
      +currentPage,
      +pageSize,
      qs,
    );
  }

  @Get(':collectionId')
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of collection',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid collection ID or validation error',
  })
  async findById(
    @Param('collectionId') collectionId: string,
    @User() user: IUser,
  ) {
    return this.collectionsService.findById(collectionId, user._id);
  }

  @Patch(':collectionId')
  @ApiOperation({ summary: 'Update a collection by id' })
  @ApiBody({ type: UpdateCollectionDto })
  @ApiResponse({ status: 200, description: 'The updated collection.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or validation error.',
  })
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

  @Patch(':collectionId/archive')
  @ApiOperation({ summary: 'Archive a collection by id' })
  @ApiResponse({ status: 200, description: 'The archived collection.' })
  @ApiResponse({
    status: 404,
    description: 'Collection with specified ID not found.',
  })
  async archive(
    @Param('collectionId') collectionId: string,
    @User() user: IUser,
  ) {
    return this.collectionsService.archiveById(collectionId, user._id);
  }

  @Patch(':collectionId/restore')
  @ApiOperation({ summary: 'Restore an archived collection by ID' })
  @ApiResponse({ status: 200, description: 'The restored collection.' })
  @ApiResponse({
    status: 404,
    description: 'Collection with specified ID not found.',
  })
  async restore(
    @Param('collectionId') collectionId: string,
    @User() user: IUser,
  ) {
    return this.collectionsService.restoreById(collectionId, user._id);
  }

  @Patch(':collectionId/delete')
  @ApiOperation({ summary: 'Delete a collection by ID' })
  @ApiResponse({ status: 200, description: 'The deleted collection.' })
  @ApiResponse({
    status: 400,
    description: 'Collection must be archived before delete.',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection with specified ID not found.',
  })
  async delete(
    @Param('collectionId') collectionId: string,
    @User() user: IUser,
  ) {
    return this.collectionsService.deleteById(collectionId, user._id);
  }
}
