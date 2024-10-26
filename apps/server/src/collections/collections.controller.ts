import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionsService } from './collections.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  async create(@Body() collectionData: CreateCollectionDto) {
    return this.collectionsService.create(collectionData);
  }

  @Get()
  async findAll() {
    return this.collectionsService.findAll();
  }
}
