import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionsService } from './collections.service';
import { ApiTags } from '@nestjs/swagger';
import { SortOptionsDto } from './dto/sort.dto';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  async create(@Body() collectionData: CreateCollectionDto) {
    return this.collectionsService.create(collectionData);
  }

  @Get()
  async findAll(@Query() sortOptions: SortOptionsDto) {
    return this.collectionsService.findAll(sortOptions);
  }
}
