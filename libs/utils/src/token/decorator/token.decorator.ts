import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

import { Response } from 'express';
import { TokenDataDto } from '../dto/token.dto';

export const TokenDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response: Response = ctx.switchToHttp().getResponse();
    return response.locals.tokenData as TokenDataDto;
  },
);

export const UseToken = () => SetMetadata('token', true);
