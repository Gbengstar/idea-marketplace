import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';

@Injectable()
export class OptionalTokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(OptionalTokenMiddleware.name);
  constructor(private readonly tokenService: TokenService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = TokenService.getToken(req);

      if (token) {
        const tokenData = await this.tokenService.verifyToken(token);

        if (!tokenData) {
          throw new BadRequestException('please provide a valid JWT token');
        }

        res.locals.role = tokenData.role;
        res.locals.tokenData = tokenData;
      }
      next();
    } catch (error) {
      this.logger.error(error);
      next();
    }
  }
}
