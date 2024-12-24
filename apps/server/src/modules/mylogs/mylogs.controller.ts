import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { MylogsService } from './mylogs.service';
import { ResponseMessage, Roles } from 'src/decorator/customize';
import { ApiOperation } from '@nestjs/swagger';
import { Role } from '../users/schema/user.schema';

@Controller('mylogs')
export class MylogsController {
  constructor(private readonly mylogsService: MylogsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all logs' })
  @ResponseMessage('Fetch list logs with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.mylogsService.findAll(+currentPage, +pageSize, qs);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete log by id' })
  @ResponseMessage('Delete a log')
  async remove(@Param('id') id: string): Promise<any> {
    return await this.mylogsService.remove(+id);
  }
}
