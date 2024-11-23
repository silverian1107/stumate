import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CLIENT_REDIRECT'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, name, emails, provider } = profile;
    let username =
      emails && emails.length > 0 ? emails[0].value.split('@')[0] : id;
    if (await this.userService.isExistUsernameOrEmail(username)) {
      let count = 1;
      while (
        await this.userService.isExistUsernameOrEmail(`${username}${count}`)
      ) {
        count++;
      }
      username = `${username}${count}`;
    }
    const user = {
      name: `${name.givenName || ''} ${name.familyName || ''}`,
      username: username,
      email: emails && emails.length > 0 ? emails[0].value : id,
      accountId: id,
      accountType: provider.toUpperCase(),
    };
    return user;
  }
}
