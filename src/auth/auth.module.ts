import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { AccountModule } from '../account/account.module';
import { AuthStrategyModule } from '../../libs/utils/src/auth-strategy/auth-strategy.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [AccountModule, AuthStrategyModule],
})
export class AuthModule {}
