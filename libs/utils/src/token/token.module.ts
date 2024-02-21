import { Global, Module } from '@nestjs/common';
import { TokenService } from './service/token.service';
import { CachingModule } from '../cache/cache.module';
import { AccountModule } from '../../../../src/account/account.module';

@Global()
@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [CachingModule, AccountModule],
})
export class TokenModule {}
