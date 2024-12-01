import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { User } from 'src/decorator/customize';
import { IUser } from '../users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './schema/todo.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import mongoose from 'mongoose';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name)
    private readonly todoModel: SoftDeleteModel<TodoDocument>,
  ) {}

  async create(createTodoDto: CreateTodoDto, @User() user: IUser) {
    const newTodo = await this.todoModel.create({
      todo: createTodoDto.todo,
      userId: user._id,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    return newTodo;
  }

  async findAll(user: IUser) {
    return await this.todoModel.find({ userId: user._id });
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid To-do ID');
    }
    const todo = await this.todoModel.findOne({ _id: id });
    if (!todo) {
      throw new NotFoundException('Not found to-do');
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, @User() user: IUser) {
    return await this.todoModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateTodoDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
  }

  async handleMarkTodoCompleted(id: string) {
    return await this.todoModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { isCompleted: true },
      },
      { new: true },
    );
  }

  remove(id: string, @User() user: IUser) {
    return this.todoModel.delete({ _id: id }, user._id);
  }
}
