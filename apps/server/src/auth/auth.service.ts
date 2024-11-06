import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import ms from 'ms';
import { UsersService } from '../modules/users/users.service';
import { IUser } from '../modules/users/users.interface';
import { comparePassword } from 'src/helpers/utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
    const user =
      await this.usersService.findUserByUsernameOrEmail(usernameOrEmail);
    if (user) {
      const isValidPassword = await comparePassword(pass, user.password);
      if (isValidPassword === true) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, username, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      username,
      email,
      role,
    };
    // Generate refresh token
    const refresh_token = this.createRefreshToken(payload);
    await this.usersService.updateUserToken(refresh_token, _id);
    // Set lastLogin to the current date and time
    await this.usersService.updateLastLogin(_id);
    // Set cookie with the refresh token
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        username,
        email,
        role,
      },
    };
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, username, email, role } = user;
        const payload = {
          sub: 'token login',
          iss: 'from server',
          _id,
          username,
          email,
          role,
        };
        const refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refresh_token, _id.toString());
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            username,
            email,
            role,
          },
        };
      } else {
        throw new BadRequestException('Invalid refresh token. Please login');
      }
    } catch {
      throw new BadRequestException('Invalid refresh token. Please login');
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'ok';
  };
}
