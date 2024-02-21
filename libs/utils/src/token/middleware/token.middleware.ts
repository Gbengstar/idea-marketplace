import { AccountService } from './../../../../../src/account/service/account.service';
import { RolesEnum } from './../../roles/enum/roles.enum';
import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';
import { CacheService } from '@app/utils/cache/service/cache.services';
import { TokenDataDto } from '../dto/token.dto';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenMiddleware.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
    private readonly accountService: AccountService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = TokenService.getToken(req);
    const tokenData = await this.tokenService.verifyToken(token);

    // token data is not valid
    if (!tokenData) {
      throw new BadRequestException('please provide a valid JWT token');
    }

    const userData = (await this.cacheService.get(
      tokenData.id,
    )) as unknown as TokenDataDto;

    let newTokenData: TokenDataDto;

    if (!userData) {
      const foundAccount = await this.accountService.findByIdOrErrorOut(
        tokenData.id,
      );

      newTokenData = {
        id: foundAccount.id,
        email: foundAccount.email,
        role: foundAccount.role,
      };
    }

    // save the new token data to redis
    await this.cacheService.set(tokenData.id, newTokenData);

    res.locals.role = tokenData.role;
    res.locals.tokenData = userData ?? newTokenData;
    next();
  }
}
