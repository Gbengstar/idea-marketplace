import { Module } from '@nestjs/common';
import { GoogleOauthService } from './service/google-oauth.service';

@Module({
  providers: [GoogleOauthService],
})
export class GoogleOauthModule {}
