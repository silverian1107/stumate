import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { AbilityGuard } from 'src/casl/ability.guard';
import { Tag } from './schema/tag.schema';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';

@Controller('tags')
@UseGuards(AbilityGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('assign-tag/:resourceType/:resourceId/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, Tag))
  @ResponseMessage('Assign tag')
  async addTag(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Param('id') id: string,
  ) {
    return await this.tagsService.handleAddTag(resourceType, resourceId, id);
  }

  @Delete('remove-tag/:resourceType/:resourceId/:id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, Tag))
  @ResponseMessage('Remove tag')
  async removeTag(
    @Param('resourceType') resourceType: string,
    @Param('resourceId') resourceId: string,
    @Param('id') id: string,
  ) {
    return await this.tagsService.handleRemoveTag(resourceType, resourceId, id);
  }

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, Tag))
  @ResponseMessage('Create a new tag')
  async create(@Body() createTagDto: CreateTagDto, @User() user: IUser) {
    const newTag = await this.tagsService.create(createTagDto, user);
    return {
      _id: newTag?._id,
      createdAt: newTag?.createdAt,
    };
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, Tag))
  @ResponseMessage('Fetch list tag')
  async findAll(@User() user: IUser) {
    return await this.tagsService.findAll(user);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, Tag))
  @ResponseMessage('Fetch tag by id')
  async findOne(@Param('id') id: string) {
    const foundTag = await this.tagsService.findOne(id);
    return foundTag;
  }

  @Get('name/:name')
  @CheckPolicies((ability) => ability.can(Action.READ, Tag))
  @ResponseMessage('Fetch tag by name')
  async findByName(@Param('name') name: string) {
    const foundTag = await this.tagsService.findByName(name);
    return foundTag;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, Tag))
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
  @CheckPolicies((ability) => ability.can(Action.DELETE, Tag))
  @ResponseMessage('Delete a tag')
  remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    return this.tagsService.remove(id, user);
  }
}
