import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Role } from '../users/schema/user.schema';
import { UsersService } from '../users/users.service';

@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('assign-tag/:resourceType/:resourceId/:id')
  @Roles(Role.USER)
  @ResponseMessage('Assign tag')
  async addTag(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    return await this.tagsService.handleAddTag(
      resourceType,
      resourceId,
      id,
      user,
    );
  }

  @Post('remove-tag/:resourceType/:resourceId/:id')
  @Roles(Role.USER)
  @ResponseMessage('Remove tag')
  async removeTag(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    return await this.tagsService.handleRemoveTag(
      resourceType,
      resourceId,
      id,
      user,
    );
  }

  @Post()
  @ResponseMessage('Create a new tag')
  async create(@Body() createTagDto: CreateTagDto, @User() user: IUser) {
    const newTag = await this.tagsService.create(createTagDto, user);
    return {
      _id: newTag?._id,
      createdAt: newTag?.createdAt,
    };
  }

  @Get()
  @ResponseMessage('Fetch list tag')
  async findAll(@User() user: IUser) {
    return await this.tagsService.findAll(user);
  }

  @Get(':id')
  @ResponseMessage('Fetch tag by id')
  async findOne(@Param('id') id: string, @User() user: IUser) {
    const foundTag = await this.tagsService.findOne(id);
    const createdByUser = await this.usersService.findOne(
      foundTag.userId.toString(),
    );
    if (user.role === 'USER') {
      if (
        foundTag.userId.toString() !== user._id &&
        createdByUser.role !== 'ADMIN'
      ) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundTag;
  }

  @Get('search')
  @ResponseMessage('Search tag by name')
  async searchByName(@Query('name') name: string, @User() user: IUser) {
    return await this.tagsService.searchByName(name, user);
  }

  @Patch(':id')
  @ResponseMessage('Update a tag')
  async update(
    @Param('id') id: string,
    @Body() createTagDto: CreateTagDto,
    @User() user: IUser,
  ) {
    const foundTag = await this.tagsService.findOne(id);
    if (user.role === 'USER') {
      if (foundTag.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return await this.tagsService.update(id, createTagDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a tag')
  async remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    const foundTag = await this.tagsService.findOne(id);
    if (user.role === 'USER') {
      if (foundTag.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return this.tagsService.remove(id, user);
  }
}
