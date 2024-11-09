import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post(':resourceType/:resourceId/:id')
  @ResponseMessage('Assign tag')
  async addTag(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Param('id') id: string,
  ) {
    return await this.tagsService.handleAddTag(resourceType, resourceId, id);
  }

  @Delete(':resourceType/:resourceId/:id')
  @ResponseMessage('Remove tag')
  async removeTag(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Param('id') id: string,
  ) {
    return await this.tagsService.handleRemoveTag(resourceType, resourceId, id);
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
  findAll(@User() user: IUser) {
    return this.tagsService.findAll(user);
  }

  @Get(':id')
  @ResponseMessage('Fetch tag by id')
  async findOne(@Param('id') id: string) {
    const foundTag = await this.tagsService.findOne(id);
    return foundTag;
  }

  @Get('name/:name')
  @ResponseMessage('Fetch tag by name')
  async findByName(@Param('name') name: string) {
    const foundTag = await this.tagsService.findByName(name);
    return foundTag;
  }

  @Patch(':id')
  @ResponseMessage('Update a tag')
  async update(
    @Param('id') id: string,
    @Body() createTagDto: CreateTagDto,
    @User() user: IUser,
  ) {
    const updateTag = await this.tagsService.update(id, createTagDto, user);
    return updateTag;
  }

  @Delete(':id')
  @ResponseMessage('Delete a tag')
  remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    return this.tagsService.remove(id, user);
  }
}
