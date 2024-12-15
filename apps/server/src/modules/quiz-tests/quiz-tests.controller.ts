import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { QuizTestsService } from './quiz-tests.service';
import { CreateQuizTestDto } from './dto/create-quiz-test.dto';
import { UpdateQuizTestDto } from './dto/update-quiz-test.dto';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Role } from '../users/schema/user.schema';

@Controller('quiz-tests')
export class QuizTestsController {
  constructor(private readonly quizTestsService: QuizTestsService) {}

  @Post()
  @Roles(Role.USER)
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
      name: newQuizTest.name,
      createdAt: newQuizTest?.createdAt,
    };
  }

  // @Post('multiple')
  // @Roles(Role.USER)
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

  @Get()
  @Roles(Role.USER)
  @ResponseMessage('Get quiz test by user')
  getByUser(@User() user: IUser, @Query() qs: string) {
    return this.quizTestsService.findByUser(user, qs);
  }

  @Get('by-note/:noteId')
  @Roles(Role.USER)
  @ResponseMessage('Get quiz test by user')
  getByNoteId(@User() user: IUser, @Param('noteId') noteId: string) {
    return this.quizTestsService.findByNoteId(noteId, user);
  }

  @Get('all')
  @Roles(Role.ADMIN)
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
  async findOne(@Param('id') id: string, @User() user: IUser) {
    const foundQuizTest = await this.quizTestsService.findOne(id);
    if (user.role === 'USER') {
      if (foundQuizTest.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundQuizTest;
  }

  @Patch(':id')
  @Roles(Role.USER)
  @ResponseMessage('Update a quiz test')
  async update(
    @Param('id') id: string,
    @Body() updateQuizTestDto: UpdateQuizTestDto,
    @User() user: IUser,
  ) {
    console.log(6);
    const foundQuizTest = await this.quizTestsService.findOne(id);
    if (foundQuizTest.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return await this.quizTestsService.update(id, updateQuizTestDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a quiz test')
  async remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    console.log(7);
    return await this.quizTestsService.remove(id, user);
  }
}
