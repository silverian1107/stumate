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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @ResponseMessage('Register a new user')
  @Post('register')
  async handleRegister(@Body() registerUserDto: RegisterUserDto) {
    const newUser = await this.usersService.register(registerUserDto);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User login')
  @Post('login')
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Verify activation code')
  @Post('verify-activation-code')
  verifyActivationCode(@Body() codeAutoDto: CodeAutoDto) {
    return this.usersService.handleVerifyActivationCode(codeAutoDto);
  }

  @Public()
  @ResponseMessage('Resend activation code')
  @Post('resend-activation-code')
  resendActivationCode(@Body('email') email: string) {
    return this.usersService.handleResendActivationCode(email);
  }

  @Public()
  @ResponseMessage('Send request password reset')
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.usersService.handleRequestPasswordReset(email);
  }

  @Public()
  @ResponseMessage('Verify password reset code')
  @Post('verify-password-reset-code')
  verifyPasswordResetCode(@Body() codeAutoDto: CodeAutoDto) {
    return this.usersService.handleVerifyPasswordResetCode(codeAutoDto);
  }

  @Public()
  @ResponseMessage('Change password')
  @Post('change-password')
  changePassword(@Body() changePasswordAutoDto: ChangePasswordAutoDto) {
    return this.usersService.handleChangePassword(changePasswordAutoDto);
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

  @ResponseMessage('User logout')
  @Post('logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
