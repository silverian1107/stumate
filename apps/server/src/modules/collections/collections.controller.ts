import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Role } from '../users/schema/user.schema';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}
  @Post()
  @Roles(Role.USER)
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
  @Roles(Role.ADMIN)
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
  @Roles(Role.USER)
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
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Retrieve all archived collections by user id' })
  @ApiResponse({ status: 200 })
  async findAllArchivedByOwnerId(@User() user: IUser) {
    return this.collectionsService.findAllArchivedByOwnerId(user._id);
  }

  @Get(':collectionId')
  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400 })
  async findById(
    @Param('collectionId') collectionId: string,
    @User() user: IUser,
  ) {
    const foundCollection =
      await this.collectionsService.findById(collectionId);
    if (user.role === 'USER') {
      if (foundCollection.ownerId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundCollection;
  }

  @Patch(':collectionId')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Update a collection by id' })
  @ApiBody({ type: UpdateCollectionDto })
  @ApiResponse({ status: 200, description: 'The updated collection.' })
  @ApiResponse({ status: 400 })
  async update(
    @Param('collectionId') collectionId: string,
    @Body() updateData: UpdateCollectionDto,
    @User() user: IUser,
  ) {
    const foundCollection =
      await this.collectionsService.findById(collectionId);
    if (foundCollection.ownerId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return this.collectionsService.updateById(collectionId, updateData);
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
  @ApiOperation({ summary: 'Delete a collection by ID' })
  @ApiResponse({ status: 200, description: 'The deleted collection.' })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 404 })
  async delete(
    @Param('collectionId') collectionId: string,
    @User() user: IUser,
  ) {
    return await this.collectionsService.deleteById(collectionId, user);
  }
}
