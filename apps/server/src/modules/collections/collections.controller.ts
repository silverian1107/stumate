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
  async create(@Body() collectionData: CreateCollectionDto) {
    return this.collectionsService.create(collectionData);
  }

  @Get()
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
    @Query() qs: string,
  ) {
    return this.collectionsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':ownerId/collections')
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
    @Param('ownerId') ownerId: string,
    @Query('currentPage') currentPage = 1,
    @Query('pageSize') pageSize = 10,
    @Query() qs: string,
  ) {
    return this.collectionsService.findByOwnerId(
      ownerId,
      +currentPage,
      +pageSize,
      qs,
    );
  }

  @Get(':ownerId/collections/archived')
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
    @Param('ownerId') ownerId: string,
    @Query('currentPage') currentPage = 1,
    @Query('pageSize') pageSize = 10,
    @Query() qs: string,
  ) {
    return this.collectionsService.findArchivedByOwnerId(
      ownerId,
      +currentPage,
      +pageSize,
      qs,
    );
  }

  @Get(':collectionId')
  @ApiOperation({ summary: 'Retrieve a collection by id' })
  @ApiResponse({
    status: 200,
    description: 'The requested collection.',
  })
  async findById(@Param('collectionId') collectionId: string) {
    return this.collectionsService.findById(collectionId);
  }

  @Patch(':collectionId')
  @ApiOperation({ summary: 'Update a collection by id' })
  @ApiBody({ type: UpdateCollectionDto })
  @ApiResponse({
    status: 200,
    description: 'The updated collection.',
  })
  async update(
    @Param('collectionId') collectionId: string,
    @Body() updateData: UpdateCollectionDto,
  ) {
    return this.collectionsService.updateById(collectionId, updateData);
  }

  @Patch(':collectionId/archive')
  @ApiOperation({ summary: 'Archive a collection by id' })
  @ApiResponse({
    status: 200,
    description: 'The archived collection.',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection with specified ID not found.',
  })
  async archive(@Param('collectionId') collectionId: string) {
    return this.collectionsService.archiveById(collectionId);
  }

  @Patch(':collectionId/restore')
  @ApiOperation({ summary: 'Restore an archived collection by ID' })
  @ApiResponse({
    status: 200,
    description: 'The restored collection.',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection with specified ID not found.',
  })
  async restore(@Param('collectionId') collectionId: string) {
    return this.collectionsService.restoreById(collectionId);
  }

  @Patch(':collectionId/delete')
  @ApiOperation({ summary: 'Delete a collection by ID' })
  @ApiResponse({
    status: 200,
    description: 'The deleted collection.',
  })
  @ApiResponse({
    status: 400,
    description: 'Collection must be archived before delete.',
  })
  @ApiResponse({
    status: 404,
    description: 'Collection with specified ID not found.',
  })
  async delete(@Param('collectionId') collectionId: string) {
    return this.collectionsService.deleteById(collectionId);
  }
}
