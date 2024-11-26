import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizTestsService } from './quiz-tests.service';
import { CreateQuizTestDto } from './dto/create-quiz-test.dto';
import { UpdateQuizTestDto } from './dto/update-quiz-test.dto';
import { CheckPolicies, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { AbilityGuard } from 'src/casl/ability.guard';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { QuizTest } from './schema/quiz-test.schema';

@Controller('quiz-tests')
@UseGuards(AbilityGuard)
export class QuizTestsController {
  constructor(private readonly quizTestsService: QuizTestsService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, QuizTest))
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
  // @CheckPolicies((ability) => ability.can(Action.CREATE, QuizTest))
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
  @CheckPolicies((ability) => ability.can(Action.READ, QuizTest))
  @ResponseMessage('Get quiz test by user')
  getByUser(@User() user: IUser) {
    return this.quizTestsService.findByUser(user);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, QuizTest))
  @ResponseMessage('Fetch list quiz test with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.quizTestsService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, QuizTest))
  @ResponseMessage('Fetch quiz test by id')
  async findOne(@Param('id') id: string) {
    const foundQuizTest = await this.quizTestsService.findOne(id);
    return foundQuizTest;
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.UPDATE, QuizTest))
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
  @CheckPolicies((ability) => ability.can(Action.DELETE, QuizTest))
  @ResponseMessage('Delete a quiz test')
  remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    return this.quizTestsService.remove(id, user);
  }
}
