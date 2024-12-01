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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, Roles, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { Role } from './schema/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ResponseMessage('Create a new user')
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    const newUser = await this.usersService.create(createUserDto, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  @Get()
  @Roles(Role.ADMIN)
  @ResponseMessage('Fetch list user with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch user by id')
  async findOne(@Param('id') id: string, @User() user: IUser) {
    const foundUser = await this.usersService.findOne(id);
    if (user.role === 'USER') {
      if (foundUser._id.toString() !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return foundUser;
  }

  @Patch()
  @ResponseMessage('Update a user')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    if (user.role === 'USER') {
      if (updateUserDto._id !== user._id) {
        throw new ForbiddenException(
          `You don't have permission to access this resource`,
        );
      }
    }
    return await this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('Delete a user')
  remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    return this.usersService.remove(id, user);
  }
}
