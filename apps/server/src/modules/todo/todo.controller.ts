import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { Role } from '../users/schema/user.schema';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @Roles(Role.USER)
  @ResponseMessage('Create a new to-do')
  async create(@Body() createTodoDto: CreateTodoDto, @User() user: IUser) {
    const newTodo = await this.todoService.create(createTodoDto, user);
    return {
      _id: newTodo?._id,
      createdAt: newTodo?.createdAt,
    };
  }

  @Get()
  @Roles(Role.USER)
  @ResponseMessage('Get all to-do')
  async findAll(@User() user: IUser) {
    return await this.todoService.findAll(user);
  }

  @Get(':id')
  @ResponseMessage('Fetch to-do by id')
  async findOne(@Param('id') id: string, @User() user: IUser) {
    const foundTodo = await this.todoService.findOne(id);
    if (user.role === 'USER') {
      if (foundTodo.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundTodo;
  }

  @Patch(':id')
  @Roles(Role.USER)
  @ResponseMessage('Update a to-do')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @User() user: IUser,
  ) {
    const foundTodo = await this.todoService.findOne(id);
    if (foundTodo.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return await this.todoService.update(id, updateTodoDto, user);
  }

  @Patch(':id/completed')
  @Roles(Role.USER)
  @ResponseMessage('Mark a to-do completed')
  async markTodoCompleted(@Param('id') id: string, @User() user: IUser) {
    const foundTodo = await this.todoService.findOne(id);
    if (foundTodo.userId.toString() !== user._id) {
      throw new ForbiddenException(
        `You don't have permission to access this resource`,
      );
    }
    return await this.todoService.handleMarkTodoCompleted(id);
  }

  @Delete(':id')
  @ResponseMessage('Delete a to-do')
  async remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    const foundTodo = await this.todoService.findOne(id);
    if (user.role === 'USER') {
      if (foundTodo.userId.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return this.todoService.remove(id, user);
  }
}
