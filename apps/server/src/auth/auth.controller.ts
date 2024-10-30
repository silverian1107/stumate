import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Response } from 'express';
import { IUser } from '../modules/users/users.interface';
import {
  ChangePasswordAutoDto,
  CodeAutoDto,
  RegisterUserDto,
} from './dto/create-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  @Public()
  @ResponseMessage('Register a new user')
  @Post('register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User login')
  @Post('login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Check code')
  @Post('check-code')
  checkCode(@Body() codeAutoDto: CodeAutoDto) {
    return this.usersService.handleActivateAccount(codeAutoDto);
  }

  @Public()
  @ResponseMessage('Retry Activate')
  @Post('retry-activate')
  retryActivate(@Body('email') email: string) {
    return this.usersService.handleRetryActivateAccount(email);
  }

  @Public()
  @ResponseMessage('Retry Password')
  @Post('retry-password')
  retryPassword(@Body('email') email: string) {
    return this.usersService.handleRetryPassword(email);
  }

  @Public()
  @ResponseMessage('Change Password')
  @Post('change-password')
  changePassword(@Body() changePasswordAutoDto: ChangePasswordAutoDto) {
    return this.usersService.handleChangePassword(changePasswordAutoDto);
  }

  @Public()
  @ResponseMessage('Send mail')
  @Get('mail')
  testMail() {
    this.mailerService.sendMail({
      to: 'hoangtuananhnguyen313@gmail.com',
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
      template: 'confirmation',
      context: {
        name: 'Tam',
        activationCode: 123456789,
      },
    });
    return 'ok';
  }

  @ResponseMessage('Get user information')
  @Get('account')
  handleGetAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('refresh')
  handleRefreshToken(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = req.cookies['refresh_token'];
    return this.authService.processNewToken(refresh_token, response);
  }

  @Public()
  @ResponseMessage('User logout')
  @Get('logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
