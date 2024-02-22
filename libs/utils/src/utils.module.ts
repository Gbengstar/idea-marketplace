import { Module } from '@nestjs/common';
import { AuthStrategyModule } from './auth-strategy/auth-strategy.module';
import { OtpModule } from './otp/otp.module';
import { DatabaseModule } from './database/database.module';

const modules = [OtpModule, AuthStrategyModule, DatabaseModule];

@Module({
  providers: modules,
  exports: modules,
  imports: [DatabaseModule],
})
export class UtilsModule {}
