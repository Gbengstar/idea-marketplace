import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { EnvConfigEnum } from '../../config/env.enum';
import { ValidateGoogleAuthDto } from '../dto/google-strategy.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleStrategyService extends PassportStrategy(
  Strategy,
  'google',
) {
  private readonly client: OAuth2Client;
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow(EnvConfigEnum.CLIENT_ID),
      clientSecret: configService.getOrThrow(EnvConfigEnum.PRIVATE_KEY),
      callbackURL: configService.getOrThrow(EnvConfigEnum.GOOGLE_CALLBACK_URL),
      scope: configService.getOrThrow(EnvConfigEnum.SCOPE),
    });

    this.client = new OAuth2Client(
      configService.getOrThrow(EnvConfigEnum.GOOGLE_CLIENT_ID),
    );
  }

  async validate({ profile, accessToken, callBack }: ValidateGoogleAuthDto) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    callBack(null, user);
  }

  async verifyGoogleToken(idToken: string) {
    const crudePayload = await this.client.verifyIdToken({ idToken });
    const payload = crudePayload.getPayload();
    if (!payload || !payload.email)
      throw new UnauthorizedException(
        'token can not be verified at the moment',
      );
    return payload;
  }
}
