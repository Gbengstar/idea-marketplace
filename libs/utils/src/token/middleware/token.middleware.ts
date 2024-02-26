import { AccountService } from './../../../../../src/account/service/account.service';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';
import { CacheService } from '@app/utils/cache/service/cache.services';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenMiddleware.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
    private readonly accountService: AccountService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = TokenService.getToken(req);
      const tokenData = await this.tokenService.verifyToken(token);

      if (!tokenData) {
        throw new BadRequestException('please provide a valid JWT token');
      }

      res.locals.role = tokenData.role;
      res.locals.tokenData = tokenData;
      next();
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException();
    }
  }
}
