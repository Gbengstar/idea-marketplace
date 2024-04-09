import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ResponseStatusEnum } from '../general/response/response.dto';

@Catch()
export class GlobalExceptionsFilter extends BaseExceptionFilter {
  private logger = new Logger(GlobalExceptionsFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if ('getStatus' in exception) status = exception?.getStatus();

    switch (exception.name) {
      case 'ValidationError': {
        status = HttpStatus.BAD_REQUEST;

        break;
      }
    }

    this.logger.debug(exception?.stack);

    response.status(status).json({
      status: ResponseStatusEnum.FAIL,
      data: {
        message: exception?.message || 'error occur',
        error: exception.name,
      },
    });
  }
}
