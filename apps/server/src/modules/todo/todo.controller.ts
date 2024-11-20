import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ResponseMessage('Create a new to-do')
  async create(@Body() createTodoDto: CreateTodoDto, @User() user: IUser) {
    const newTodo = await this.todoService.create(createTodoDto, user);
    return {
      _id: newTodo?._id,
      createdAt: newTodo?.createdAt,
    };
  }

  @Get()
  @ResponseMessage('Get all to-do')
  async findAll(@User() user: IUser) {
    return await this.todoService.findAll(user);
  }

  @Get(':id')
  @ResponseMessage('Fetch to-do by id')
  async findOne(@Param('id') id: string) {
    const foundTodo = await this.todoService.findOne(id);
    return foundTodo;
  }

  @Patch(':id')
  @ResponseMessage('Update a to-do')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @User() user: IUser,
  ) {
    return await this.todoService.update(id, updateTodoDto, user);
  }

  @Patch(':id/completed')
  @ResponseMessage('Mark a to-do completed')
  async markTodoCompleted(@Param('id') id: string) {
    return await this.todoService.handleMarkTodoCompleted(id);
  }

  @Delete(':id')
  @ResponseMessage('Delete a to-do')
  remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    return this.todoService.remove(id, user);
  }
}
