import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  async getHello() {
    // await 2 second
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return this.appService.getHello();
  }
  @Public()
  @Get('error')
  getError(): string {
    throw new UnauthorizedException('Unauthorized');
  }

  @Public()
  @Get('normal')
  getNormal() {
    return { hello: 'World' };
  }
  @Public()
  @Get('withId')
  getWithId() {
    return { hello: 'Id' };
  }
}
