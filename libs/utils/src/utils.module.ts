import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { AuthStrategyModule } from './auth-strategy/auth-strategy.module';

@Module({
  providers: [UtilsService],
  exports: [UtilsService],
  imports: [AuthStrategyModule],
})
export class UtilsModule {}
