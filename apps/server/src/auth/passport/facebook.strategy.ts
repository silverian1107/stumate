import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CLIENT_REDIRECT'),
      profileFields: ['displayName', 'name', 'emails'],
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
      name: `${name.givenName || ''} ${name.middleName || ''} ${name.familyName || ''}`,
      username: username,
      email: emails && emails.length > 0 ? emails[0].value : id,
      accountId: id,
      accountType: provider.toUpperCase(),
    };
    return user;
  }
}
