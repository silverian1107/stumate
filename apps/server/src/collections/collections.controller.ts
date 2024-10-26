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
import { SortOptionsDto } from './dto/sort.dto';
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
  @ApiOperation({ summary: 'Retrieve all collections' })
  @ApiQuery({
    name: 'sortBy',
    description: 'The field to sort by (name, position, createdAt, updatedAt)',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'order',
    description: 'The order of sorting (asc or desc)',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of root-level collections.',
    isArray: true,
  })
  async findAll(@Query() sortOptions: SortOptionsDto) {
    return this.collectionsService.findAll(sortOptions);
  }

  @Get(':ownerId/collections')
  @ApiOperation({ summary: 'Retrieve collections by user id' })
  @ApiQuery({
    name: 'sortBy',
    description: 'The field to sort by (name, position, createdAt, updatedAt)',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'order',
    description: 'The order of sorting (asc or desc)',
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
    @Query() sortOptions: SortOptionsDto,
  ) {
    return this.collectionsService.findByOwnerId(ownerId, sortOptions);
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
}
