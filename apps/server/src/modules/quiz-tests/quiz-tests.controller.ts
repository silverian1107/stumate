import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QuizTestsService } from './quiz-tests.service';
import { CreateQuizTestDto } from './dto/create-quiz-test.dto';
import { UpdateQuizTestDto } from './dto/update-quiz-test.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller('quiz-tests')
export class QuizTestsController {
  constructor(private readonly quizTestsService: QuizTestsService) {}

  @Post()
  @ResponseMessage('Create a new quiz test')
  async create(
    @Body() createQuizTestDto: CreateQuizTestDto,
    @User() user: IUser,
  ) {
    const newQuizTest = await this.quizTestsService.create(
      createQuizTestDto,
      user,
    );
    return {
      _id: newQuizTest?._id,
      createdAt: newQuizTest?.createdAt,
    };
  }

  // @Post('multiple')
  // @ResponseMessage('Create multiple quiz tests')
  // async createMultiple(
  //   @Body() createQuizTestDtos: CreateQuizTestDto[],
  //   @User() user: IUser,
  // ) {
  //   const newQuizTests = await this.quizTestsService.createMultiple(
  //     createQuizTestDtos,
  //     user,
  //   );
  //   return newQuizTests.map((quizTest: any) => ({
  //     _id: quizTest._id,
  //     createdAt: quizTest.createdAt,
  //   }));
  // }

  @Post('user')
  @ResponseMessage('Get quiz test by user')
  getByUser(@User() user: IUser) {
    return this.quizTestsService.findByUser(user);
  }

  @Get()
  @ResponseMessage('Fetch list quiz test with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.quizTestsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch quiz test by id')
  async findOne(@Param('id') id: string) {
    const foundQuizTest = await this.quizTestsService.findOne(id);
    return foundQuizTest;
  }

  @Patch(':id')
  @ResponseMessage('Update a quiz test')
  async update(
    @Param('id') id: string,
    @Body() updateQuizTestDto: UpdateQuizTestDto,
    @User() user: IUser,
  ) {
    const updateDeck = await this.quizTestsService.update(
      id,
      updateQuizTestDto,
      user,
    );
    return updateDeck;
  }

  @Delete(':id')
  @ResponseMessage('Delete a quiz test')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.quizTestsService.remove(id, user);
  }
}
