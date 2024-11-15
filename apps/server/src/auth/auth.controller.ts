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
  ChangePasswordAuthDto,
  CodeAuthDto,
  RegisterUserDto,
} from './dto/create-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { GoogleAuthGuard } from './passport/google-auth.guard';

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
  verifyActivationCode(@Body() codeAuthDto: CodeAuthDto) {
    return this.usersService.handleVerifyActivationCode(codeAuthDto);
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
  verifyPasswordResetCode(@Body() codeAuthDto: CodeAuthDto) {
    return this.usersService.handleVerifyPasswordResetCode(codeAuthDto);
  }

  @Public()
  @ResponseMessage('Change password')
  @Post('change-password')
  changePassword(@Body() changePasswordAuthDto: ChangePasswordAuthDto) {
    return this.usersService.handleChangePassword(changePasswordAuthDto);
  }

  // F5 refresh
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

  @Public()
  @ResponseMessage('Login with google')
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  loginWithGoogle() {}

  @Public()
  @ResponseMessage('Login with google redirect')
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.handleGoogleAuthRedirect(user, response);
  }
}
