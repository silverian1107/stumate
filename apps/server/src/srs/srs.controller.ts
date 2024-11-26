import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SrsService } from './srs.service';
import { Public } from 'src/decorator/customize';

@Controller('srs')
export class SrsController {
  constructor(private readonly srsService: SrsService) {}

  @Post()
  @Public()
  async createSrs(
    @Body() body: { front: string; back: string; createdBy: any },
  ) {
    return this.srsService.createSrs(body.front, body.back);
  }

  @Get()
  @Public()
  async getAllSrs() {
    return this.srsService.getAllSrs();
  }

  @Patch(':id/study')
  @Public()
  async studyCard(@Param('id') id: string) {
    await this.srsService.studyCard(id);
    return { message: 'Card studied successfully' };
  }

  @Get('/due-cards')
  @Public()
  async getDueCards() {
    return this.srsService.getDueCards();
  }
}
