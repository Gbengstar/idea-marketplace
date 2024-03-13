import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { EnvConfigEnum } from '../../config/env.enum';

@Injectable()
export class GoogleOauthService {
  private readonly client: OAuth2Client;
  private readonly client_id: string;
  constructor(private readonly configService: ConfigService) {
    this.client = new OAuth2Client({
      clientId: configService.getOrThrow(EnvConfigEnum.TEST_CLIENT_ID),
      clientSecret: configService.getOrThrow(EnvConfigEnum.TEST_CLIENT_SECRET),
    });
    this.client_id = configService.getOrThrow(EnvConfigEnum.TEST_CLIENT_ID);
  }

  async getTokenInfo(token: string) {
    return this.client.getTokenInfo(token);
  }
}
