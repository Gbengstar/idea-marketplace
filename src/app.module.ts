import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { envValidator } from '../libs/utils/src/env/validator/env.validator';
import { UtilsModule } from '../libs/utils/src';
import { TokenMiddleware } from '../libs/utils/src/token/middleware/token.middleware';
import { RequestLoggerMiddleware } from '../libs/utils/src/middleware/requestLogger.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.GET },
        { path: '/employees/check/:employeeId', method: RequestMethod.GET },
        { path: '/employees/login', method: RequestMethod.POST },
        { path: '/admins/sign-up', method: RequestMethod.POST },
        { path: '/admins/login', method: RequestMethod.POST },
        { path: '/otp', method: RequestMethod.POST },
        { path: '/otp/admin', method: RequestMethod.POST },
        { path: '/otp/employee', method: RequestMethod.POST },
        { path: '/business/search', method: RequestMethod.GET },
        { path: '/request-access', method: RequestMethod.POST },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });

    consumer.apply(RequestLoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
