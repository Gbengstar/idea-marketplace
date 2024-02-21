import { Module } from '@nestjs/common';
import { AuthStrategyService } from './service/auth-strategy.service';
import { GoogleStrategyService } from './service/google-strategy.service';

@Module({
  providers: [AuthStrategyService, GoogleStrategyService],
  exports: [AuthStrategyService, GoogleStrategyService],
})
export class AuthStrategyModule {}
