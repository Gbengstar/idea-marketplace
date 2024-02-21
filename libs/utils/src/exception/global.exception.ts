import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ResponseStatusEnum } from '../general/response/response.dto';
import * as Joi from 'joi';

@Catch()
export class GlobalExceptionsFilter extends BaseExceptionFilter {
  private logger = new Logger(GlobalExceptionsFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: { message: string; error: string } = {
      message: 'Internal Server Error',
      error: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as { message: string; error: string };
    }

    if (exception instanceof Joi.ValidationError) {
      status = 400;
      message = { message: exception.message, error: exception.name };
    }

    this.logger.error(exception);
    this.logger.debug(exception?.stack);

    response.status(status).json({
      status: ResponseStatusEnum.FAIL,
      message: message?.message,
      data: { error: message.error },
    });
  }
}
