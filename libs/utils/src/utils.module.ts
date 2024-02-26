import { Module } from '@nestjs/common';
import { AuthStrategyModule } from './auth-strategy/auth-strategy.module';
import { OtpModule } from './otp/otp.module';
import { DatabaseModule } from './database/database.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    OtpModule,
    AuthStrategyModule,
    DatabaseModule,
    TokenModule,
    DatabaseModule,
  ],
})
export class UtilsModule {}
