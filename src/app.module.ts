import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { envValidator } from '../libs/utils/src/env/validator/env.validator';
import { UtilsModule } from '../libs/utils/src';

@Module({
  imports: [
    UtilsModule,
    AccountModule,
    AuthModule,
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      ignoreErrors: false,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidator,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
