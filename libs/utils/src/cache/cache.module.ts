import { Global, Module } from '@nestjs/common';
import { CacheService } from './service/cache.services';
// import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  controllers: [],
  providers: [CacheService],
  exports: [CacheService],
  // imports: [CacheModule.register({ isGlobal: true })],
})
export class CachingModule {}
