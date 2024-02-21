import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from '../libs/utils/src/exception/global.exception';
import { envConfigValidator } from '../libs/utils/src/config/config.validator';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from '../libs/utils/src/config/env.enum';
import { TokenMiddlewareGuard } from '../libs/utils/src/token/guard/token.guard';
import * as express from 'express';
import { GlobalResponseInterceptor } from '../libs/utils/src/interceptor/global.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionsFilter(httpAdapter));

  app.enableCors();
  await envConfigValidator.validateAsync(process.env, {
    stripUnknown: true,
  });
  const configService = app.get(ConfigService);

  const port = configService.get<number>(EnvConfigEnum.PORT);

  app.setGlobalPrefix('api/v1/');

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new TokenMiddlewareGuard(reflector));

  /**To support payload with large size */
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  await app.listen(port);
  Logger.debug(`listening on port ${port}`);
}
bootstrap();
