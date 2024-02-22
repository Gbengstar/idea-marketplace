import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { AccountModule } from '../account/account.module';
import { AuthStrategyModule } from '../../libs/utils/src/auth-strategy/auth-strategy.module';
import { TokenService } from '../../libs/utils/src/token/service/token.service';
import { OtpModule } from '../../libs/utils/src';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  imports: [AccountModule, AuthStrategyModule, OtpModule],
})
export class AuthModule {}
