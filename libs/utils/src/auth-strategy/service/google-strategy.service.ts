import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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
  private readonly logger = new Logger(GoogleStrategyService.name);

  private readonly client: OAuth2Client;
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow(EnvConfigEnum.TEST_CLIENT_ID),
      clientSecret: configService.getOrThrow(EnvConfigEnum.TEST_CLIENT_SECRET),
      callbackURL: 'http://localhost:3000', //configService.getOrThrow(EnvConfigEnum.GOOGLE_CALLBACK_URL),
      scope: ['profile', 'email'], //['https://www.googleapis.com/auth/cloud-platform'], //configService.getOrThrow(EnvConfigEnum.SCOPE),
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

  // async verifyGoogleToken(idToken: string) {
  //   this.logger.log({ idToken });
  //   const crudePayload = await this.client.getAccessToken(idToken);

  //   this.logger.log({ crudePayload });
  //   // const payload = crudePayload.getPayload();
  //   // if (!payload || !payload.email)
  //   //   throw new UnauthorizedException(
  //   //     'token can not be verified at the moment',
  //   //   );
  //   return crudePayload;
  // }

  async getAccessToken(idToken: string) {
    this.logger.log({ idToken });
    const tokens = await this.client.getToken(idToken);

    this.logger.log({ tokens });

    return tokens;
  }
}
