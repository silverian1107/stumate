import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search across Decks, Notes, and QuizTests' })
  @ApiQuery({
    name: 'query',
    description: 'Search query',
    required: false,
    type: String,
  })
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
  @ApiResponse({
    status: 200,
    description: 'Return search results.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async search(
    @Query('query') query?: string,
    @Query('currentPage') currentPage = 1,
    @Query('pageSize') pageSize = 10,
    @User() user?: IUser,
  ) {
    return this.searchService.searchEntities(
      user,
      query,
      +currentPage,
      +pageSize,
    );
  }
}
