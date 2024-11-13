import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { User as UserModel, UserDocument } from './schema/user.schema';
import { getHashPassword } from 'src/helpers/utils';
import mongoose from 'mongoose';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  RegisterUserDto,
} from 'src/auth/dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { DecksService } from '../decks/decks.service';
import { QuizTestsService } from '../quiz-tests/quiz-tests.service';
import { TagsService } from '../tags/tags.service';
import { SoftDeleteModel } from 'mongoose-delete';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly decksService: DecksService,
    private readonly quizTestsService: QuizTestsService,
    private readonly tagsService: TagsService,
  ) {}

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { lastLogin: new Date() });
  }

  isExistUsernameOrEmail = async (usernameOrEmail: string) => {
    const user = await this.findUserByUsernameOrEmail(usernameOrEmail);
    if (user) return true;
    return false;
  };

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken });
  };

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken });
  };

  handleSendEmail = async (user: any, subject: string, template: string) => {
    this.mailerService.sendMail({
      to: user.email,
      subject,
      template,
      context: {
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
      throw new BadRequestException('Invalid User ID');
    }
    const user = await this.userModel.findOne({ _id: id }).select('-password');
    if (!user) {
      throw new NotFoundException('Not found user');
    }
    return user;
  }

  async findUserByUsernameOrEmail(usernameOrEmail: string) {
    return await this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  handleVerifyActivationCode = async (codeAuthDto: CodeAuthDto) => {
    const user = await this.userModel
      .findOne({
        _id: codeAuthDto._id,
        codeId: codeAuthDto.codeId,
      })
      .select('-password');
    if (user) {
      //Check code expired
      const isCodeExpired = dayjs().isBefore(user.codeExpire);
      if (isCodeExpired) {
        await this.userModel.updateOne(
          { _id: codeAuthDto._id },
          { isActive: true },
        );
        return user;
      }
    }
    throw new BadRequestException('Code is invalid or has expired');
  };

  handleResendActivationCode = async (email: string) => {
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
      'Activate your account',
      'account-activation-email',
    );
    return { _id: user._id };
  };

  handleRequestPasswordReset = async (email: string) => {
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
    await this.handleSendEmail(user, 'Password reset', 'reset-password-email');
    return { _id: user._id, email: user.email };
  };

  handleVerifyPasswordResetCode = async (codeAuthDto: CodeAuthDto) => {
    const user = await this.userModel
      .findOne({
        _id: codeAuthDto._id,
        codeId: codeAuthDto.codeId,
      })
      .select('-password');
    if (!user) {
      throw new BadRequestException('Account does not exist');
    }
    //Check code expired
    const isCodeExpired = dayjs().isBefore(user.codeExpire);
    if (!isCodeExpired) {
      throw new BadRequestException('Code is invalid or has expired');
    }
    return user;
  };

  handleChangePassword = async (
    changePasswordAuthDto: ChangePasswordAuthDto,
  ) => {
    const user = await this.userModel
      .findOne({
        email: changePasswordAuthDto.email,
      })
      .select('-password');
    if (!user) {
      throw new BadRequestException('Account does not exist');
    }
    const newPassword = await getHashPassword(changePasswordAuthDto.password);
    await user.updateOne({ password: newPassword });
    return user;
  };

  async register(registerUserDto: RegisterUserDto) {
    const { username, email, password } = registerUserDto;
    //Check username already exists
    if (await this.isExistUsernameOrEmail(username)) {
      throw new BadRequestException(
        `Username '${username}' already exists. Please use another username`,
      );
    }
    //Check email already exists
    if (await this.isExistUsernameOrEmail(email)) {
      throw new BadRequestException(
        `Email '${email}' already exists. Please use another email`,
      );
    }
    //Hash password
    const hashPassword = await getHashPassword(password);
    const codeId = this.getCodeId();
    const newUser = await this.userModel.create({
      username,
      email,
      password: hashPassword,
      codeId,
      codeExpire: dayjs().add(
        ms(this.configService.get<string>('CODE_EXPIRE_TIME')),
      ),
    });
    //Send email
    await this.handleSendEmail(
      newUser,
      'Activate your account',
      'account-activation-email',
    );
    return newUser;
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const { username, email, password, role } = createUserDto;
    //Check username already exists
    if (await this.isExistUsernameOrEmail(username)) {
      throw new BadRequestException(
        `Username '${username}' already exists. Please use another username`,
      );
    }
    //Check email already exists
    if (await this.isExistUsernameOrEmail(email)) {
      throw new BadRequestException(
        `Email '${email}' already exists. Please use another email`,
      );
    }
    //Hash password
    const hashPassword = await getHashPassword(password);
    const newUser = await this.userModel.create({
      username,
      email,
      password: hashPassword,
      role,
      createdBy: {
        _id: user._id,
        username: user.username,
      },
    });
    //Send email
    await this.handleSendEmail(
      newUser,
      'Activate your account',
      'account-activation-email',
    );
    return newUser;
  }

  async findAll(currentPage: number, pageSize: number, qs: string) {
    const { filter, sort, population, projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    currentPage = currentPage ? currentPage : 1;
    const limit = pageSize ? pageSize : 10;
    const offset = (currentPage - 1) * limit;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / limit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .select(projection as any)
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
    return await this.userModel.findOneAndUpdate(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          username: user.username,
        },
      },
      { new: true },
    );
  }

  async remove(id: string, @User() user: IUser) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Invalid User ID');
    }
    const existingUser = await this.userModel.findOne({ _id: id });
    if (!existingUser) {
      throw new NotFoundException('Not found user');
    }
    //soft delete for all tag
    const tags = await this.tagsService.findAll(user);
    await Promise.all(
      tags.map((tag: any) => this.tagsService.remove(tag._id.toString(), user)),
    );
    //soft delete for all deck and flashcard
    const decks = await this.decksService.findByUser(user);
    await Promise.all(
      decks.map((deck: any) =>
        this.decksService.remove(deck._id.toString(), user),
      ),
    );
    //soft delete for all quiz test, quiz question and quiz attempt
    const quizTests = await this.quizTestsService.findByUser(user);
    await Promise.all(
      quizTests.map((quizTest: any) =>
        this.quizTestsService.remove(quizTest._id.toString(), user),
      ),
    );
    //soft delete for user
    return this.userModel.delete({ _id: id }, user._id);
  }
}
