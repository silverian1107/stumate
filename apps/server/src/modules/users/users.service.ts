import { getCodeId } from './../../helpers/utils';
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
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { SoftDeleteModel } from 'mongoose-delete';
import { UserStatisticDocument } from '../statistics/schema/user-statistic.schema';
import { QuizAttemptDocument } from '../quiz-attempts/schema/quiz-attempt.schema';
import { CollectionDocument } from '../collections/schema/collection.schema';
import { NoteDocument } from '../notes/schema/note.schema';
import { SummaryDocument } from '../summaries/schema/summary.schema';
import { DeckDocument } from '../decks/schema/deck.schema';
import { FlashcardDocument } from '../flashcards/schema/flashcard.schema';
import { FlashcardReviewDocument } from '../flashcards/schema/flashcard-review.schema';
import { QuizTestDocument } from '../quiz-tests/schema/quiz-test.schema';
import { QuizQuestionDocument } from '../quiz-questions/schema/quiz-question.schema';
import { TagDocument } from '../tags/schema/tag.schema';
import { NotificationDocument } from '../notifications/schema/notification.schema';
import { TodoDocument } from '../todo/schema/todo.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    @InjectModel('Collection')
    private readonly collectionModel: SoftDeleteModel<CollectionDocument>,
    @InjectModel('Note')
    private readonly noteModel: SoftDeleteModel<NoteDocument>,
    @InjectModel('Summary')
    private readonly summaryModel: SoftDeleteModel<SummaryDocument>,
    @InjectModel('Deck')
    private readonly deckModel: SoftDeleteModel<DeckDocument>,
    @InjectModel('Flashcard')
    private readonly flashcardModel: SoftDeleteModel<FlashcardDocument>,
    @InjectModel('FlashcardReview')
    private readonly flashcardReviewModel: SoftDeleteModel<FlashcardReviewDocument>,
    @InjectModel('QuizTest')
    private readonly quizTestModel: SoftDeleteModel<QuizTestDocument>,
    @InjectModel('QuizQuestion')
    private readonly quizQuestionModel: SoftDeleteModel<QuizQuestionDocument>,
    @InjectModel('QuizAttempt')
    private readonly quizAttemptModel: SoftDeleteModel<QuizAttemptDocument>,
    @InjectModel('Tag')
    private readonly tagModel: SoftDeleteModel<TagDocument>,
    @InjectModel('Notification')
    private readonly notificationModel: SoftDeleteModel<NotificationDocument>,
    @InjectModel('Todo')
    private readonly todoModel: SoftDeleteModel<TodoDocument>,
    @InjectModel('UserStatistic')
    private readonly userStatisticModel: SoftDeleteModel<UserStatisticDocument>,
  ) {}

  async updateUserSocialAccount(userId: string, user: IUser) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        accountId: user.accountId,
        accountType: user.accountType,
        isActive: true,
      },
      { new: true },
    );
  }

  async createSocialAccount(user: IUser) {
    const newUser = await this.userModel.create({
      name: user.name,
      username: user.username,
      email: user.email,
      isActive: true,
      accountId: user.accountId,
      accountType: user.accountType,
    });
    return newUser;
  }

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
    const user = await this.userModel.findOne({
      email: codeAuthDto.email,
      codeId: codeAuthDto.codeId,
    });

    if (user) {
      //Check code expired
      const isCodeExpired = dayjs().isBefore(user.codeExpire);
      if (isCodeExpired) {
        await this.userModel.updateOne(
          { email: codeAuthDto.email },
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
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        email,
      },
      {
        codeId: getCodeId(),
        codeExpire: dayjs().add(
          ms(this.configService.get<string>('CODE_EXPIRE_TIME')),
        ),
      },
      { new: true },
    );
    await this.handleSendEmail(
      updatedUser,
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
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        email,
      },
      {
        codeId: getCodeId(),
        codeExpire: dayjs().add(
          ms(this.configService.get<string>('CODE_EXPIRE_TIME')),
        ),
      },
      { new: true },
    );
    await this.handleSendEmail(
      updatedUser,
      'Password reset',
      'reset-password-email',
    );
    return { _id: user._id, email: user.email };
  };

  handleVerifyPasswordResetCode = async (codeAuthDto: CodeAuthDto) => {
    const user = await this.userModel
      .findOne({
        email: codeAuthDto.email,
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
    await this.userModel.updateOne(
      { email: user.email },
      { password: newPassword },
    );
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
    const codeId = getCodeId();
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
    const updatedProfile = await this.userModel.findOneAndUpdate(
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
    //send notification
    await this.notificationsService.sendSuccessNotification(
      updatedProfile,
      `Profile Updated`,
      `Your profile has been updated successfully.`,
    );
    return updatedProfile;
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
    await this.tagModel.delete({ userId: id }, user._id);
    //soft delete for all collection, note, summary
    await this.summaryModel.delete({ userId: id }, user._id);
    await this.noteModel.delete({ ownerId: id }, user._id);
    await this.collectionModel.delete({ ownerId: id }, user._id);
    //soft delete for all deck, flashcard and flashcard review
    await this.flashcardReviewModel.delete({ userId: id }, user._id);
    await this.flashcardModel.delete({ userId: id }, user._id);
    await this.deckModel.delete({ userId: id }, user._id);
    //soft delete for all quiz test, quiz question and quiz attempt
    await this.quizAttemptModel.delete({ userId: id }, user._id);
    await this.quizQuestionModel.delete({ userId: id }, user._id);
    await this.quizTestModel.delete({ userId: id }, user._id);
    //soft delete for all notification
    await this.notificationModel.delete({ userId: id }, user._id);
    //soft delete for all statistic
    await this.userStatisticModel.delete({ userId: id }, user._id);
    //soft delete for all todo list
    await this.todoModel.delete({ userId: id }, user._id);
    //soft delete for user
    await this.userModel.delete({ _id: id }, user._id);
    return 'User was deleted successfully';
  }
}
