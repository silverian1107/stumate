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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CheckPolicies,
  Public,
  ResponseMessage,
  User,
} from 'src/decorator/customize';
import { IUser } from './users.interface';
import { AbilityGuard } from 'src/casl/ability.guard';
import { Action } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { User as UserModel } from 'src/modules/users/schema/user.schema';

@Controller('users')
@UseGuards(AbilityGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.CREATE, UserModel))
  @ResponseMessage('Create a new user')
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    const newUser = await this.usersService.create(createUserDto, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.READ, UserModel))
  @ResponseMessage('Fetch list user with pagination')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +pageSize, qs);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.READ, UserModel))
  @Public()
  @ResponseMessage('Fetch user by id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }

  @Patch()
  @CheckPolicies((ability) => ability.can(Action.UPDATE, UserModel))
  @ResponseMessage('Update a user')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    const updateUser = await this.usersService.update(updateUserDto, user);
    return updateUser;
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.DELETE, UserModel))
  @ResponseMessage('Delete a user')
  remove(@Param('id') id: string, @User() user: IUser): Promise<any> {
    return this.usersService.remove(id, user);
  }
}
