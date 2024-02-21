import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { TokenDataDto } from '../dto/token.dto';

@Injectable()
export class TokenMiddlewareGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext) {
    const useToken = this.reflector.get<boolean>('token', context.getHandler());
    if (!useToken) return true;

    try {
      const response: Response = context.switchToHttp().getResponse();
      const tokenData = response.locals.tokenData as TokenDataDto;

      if (!tokenData) {
        throw new NotFoundException('authorization token not found');
      }
      return true;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
