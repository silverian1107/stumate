import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { User as UserModel, UserDocument } from './schema/user.schema';
import { getHashPassword } from 'src/helpers/utils';
import mongoose from 'mongoose';
import {
  ChangePasswordAutoDto,
  CodeAutoDto,
  RegisterUserDto,
} from 'src/auth/dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  isExistEmail = async (email: string) => {
    const user = await this.userModel.findOne({ email });
    if (user) return true;
    return false;
  };

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };

  handleSendEmail = async (user: any, title: string, subject: string) => {
    this.mailerService.sendMail({
      to: user.email,
      subject: subject,
      template: 'confirmation',
      context: {
        title,
        name: user.name,
        activationCode: user.codeId,
      },
    });
  };

  getCodeId = () => {
    let uuidDigits = uuidv4().replace(/\D/g, '');
    while (uuidDigits.length < 6) {
      uuidDigits += Math.floor(Math.random() * 10).toString();
    }
    return uuidDigits.slice(0, 6);
  };

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return `Not found user`;
    }
    return await this.userModel.findOne({ _id: id }).select('-password');
  }

  async findUserByUsernameOrEmail(usernameOrEmail: string) {
    return await this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  handleActivateAccount = async (codeAutoDto: CodeAutoDto) => {
    const user = await this.userModel.findOne({
      _id: codeAutoDto._id,
      codeId: codeAutoDto.codeId,
    });
    if (user) {
      //Check code expired
      const isCodeExpired = dayjs().isBefore(user.codeExpire);
      if (isCodeExpired) {
        await this.userModel.updateOne(
          { _id: codeAutoDto._id },
          { isActive: true },
        );
        return user;
      }
    }
    throw new BadRequestException('Code is invalid or has expired');
  };

  handleRetryActivateAccount = async (email: string) => {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Account does not exist');
    }
    if (user.isActive) {
      throw new BadRequestException('Your account has been activated');
    }
    await this.userModel.updateOne({
      codeId: this.getCodeId(),
      codeExpire: dayjs().add(
        ms(this.configService.get<string>('CODE_EXPIRE_TIME')),
      ),
    });
    await this.handleSendEmail(
      user,
      'Welcome to stumate',
      'Activate your account',
    );
    return { _id: user._id };
  };

  handleRetryPassword = async (email: string) => {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Account does not exist');
    }
    if (!user.isActive) {
      throw new BadRequestException('Your account has not been activated');
    }
    await this.userModel.updateOne({
      codeId: this.getCodeId(),
      codeExpire: dayjs().add(
        ms(this.configService.get<string>('CODE_EXPIRE_TIME')),
      ),
    });
    await this.handleSendEmail(
      user,
      'Password reset',
      'Change your password account',
    );
    return { _id: user._id, email: user.email };
  };

  handleChangePassword = async (
    changePasswordAutoDto: ChangePasswordAutoDto,
  ) => {
    if (
      changePasswordAutoDto.confirmPassword !== changePasswordAutoDto.password
    ) {
      throw new BadRequestException(
        'Password and Confirm Password does not match',
      );
    }
    const user = await this.userModel.findOne({
      email: changePasswordAutoDto.email,
    });
    if (!user) {
      throw new BadRequestException('Account does not exist');
    }
    const isCodeExpired = dayjs().isBefore(user.codeExpire);
    if (isCodeExpired) {
      const newPassword = await getHashPassword(changePasswordAutoDto.password);
      await user.updateOne({ password: newPassword });
      return user;
    }
    throw new BadRequestException('Code is invalid or has expired');
  };

  async register(registerUserDto: RegisterUserDto) {
    const { name, username, email, password, birthday, gender, avatarUrl } =
      registerUserDto;
    //Check email already exists
    if (await this.isExistEmail(email)) {
      throw new BadRequestException(
        `Email ${email} already exists. Please use another email`,
      );
    }
    //Hash password
    const hashPassword = await getHashPassword(password);
    const codeId = this.getCodeId();
    const newUser = await this.userModel.create({
      name,
      username,
      email,
      password: hashPassword,
      birthday,
      gender,
      avatarUrl,
      codeId,
      codeExpire: dayjs().add(
        ms(this.configService.get<string>('CODE_EXPIRE_TIME')),
      ),
    });
    //Send email
    await this.handleSendEmail(
      newUser,
      'Welcome to stumate',
      'Activate your account',
    );
    return newUser;
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const {
      name,
      username,
      email,
      password,
      birthday,
      gender,
      avatarUrl,
      role,
    } = createUserDto;
    //Check email already exists
    if (await this.isExistEmail(email)) {
      throw new BadRequestException(
        `Email ${email} already exists. Please use another email`,
      );
    }
    //Hash password
    const hashPassword = await getHashPassword(password);
    const newUser = await this.userModel.create({
      name,
      username,
      email,
      password: hashPassword,
      birthday,
      gender,
      avatarUrl,
      role,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newUser;
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage ? currentPage : 1 - 1) * limit;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async update(updateUserDto: UpdateUserDto, @User() user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid User ID');
    }
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new NotFoundException('Not found user');
    }
    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({ _id: id });
  }
}
