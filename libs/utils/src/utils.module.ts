import { Module } from '@nestjs/common';
import { AuthStrategyModule } from './auth-strategy/auth-strategy.module';
import { OtpModule } from './otp/otp.module';
import { DatabaseModule } from './database/database.module';
import { TokenModule } from './token/token.module';
import { EmailModule } from './email/email.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { GoogleOauthModule } from './google-oauth/google-oauth.module';
import { CronJobModule } from './cron-job/cron-job.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    OtpModule,
    AuthStrategyModule,
    DatabaseModule,
    TokenModule,
    DatabaseModule,
    EmailModule,
    FileUploadModule,
    GoogleOauthModule,
    CronJobModule,
    ScheduleModule.forRoot(),
  ],
})
export class UtilsModule {}
