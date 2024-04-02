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
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { StoreModule } from './store/store.module';
import { CatalogModule } from './catalog/catalog.module';
import { AdsModule } from './ads/ads.module';
import { WishListModule } from './wish-list/wish-list.module';
import { PromotionModule } from './promotion/promotion.module';
import { JobModule } from './job/job.module';
import { TalentModule } from './talent/talent.module';

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

    ReviewModule,

    NotificationModule,

    SubscriptionModule,

    StoreModule,

    CatalogModule,

    AdsModule,

    WishListModule,

    PromotionModule,

    JobModule,

    TalentModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .exclude({ path: '/api/v1', method: RequestMethod.GET })
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: '/api/v1', method: RequestMethod.GET },
        {
          path: '/api/v1/auth/vendor/local-sign-up',
          method: RequestMethod.POST,
        },
        { path: '/api/v1/auth/vendor/local-login', method: RequestMethod.POST },
        { path: '/api/v1/auth/verify-otp', method: RequestMethod.POST },
        { path: '/api/v1/auth/forget-password', method: RequestMethod.POST },
        {
          path: '/api/v1/auth/vendor/google-sign-up',
          method: RequestMethod.POST,
        },
        {
          path: '/api/v1/auth/vendor/google-login',
          method: RequestMethod.POST,
        },
        { path: '/api/v1/promotion', method: RequestMethod.GET },
        { path: '/api/v1/ads/landing-page', method: RequestMethod.GET },
        { path: '/api/v1/ads/search', method: RequestMethod.GET },
        { path: '/api/v1/store/landing-page', method: RequestMethod.GET },
        { path: '/api/v1/store/search', method: RequestMethod.GET },
        { path: '/api/v1/job/landing-page', method: RequestMethod.GET },
        { path: '/api/v1/job/search', method: RequestMethod.GET },
        { path: '/api/v1/talent/landing-page', method: RequestMethod.GET },
        { path: '/api/v1/talent/search', method: RequestMethod.GET },
        { path: '/api/v1/catalog/category', method: RequestMethod.GET },
        { path: '/api/v1/catalog/sub-category', method: RequestMethod.GET },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
