import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../service/token.service';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TokenMiddleware.name);
  constructor(private readonly tokenService: TokenService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.tokenService.getToken(req);

      if (!token) {
        throw new BadRequestException('please provide a valid token');
      }
      const tokenData = await this.tokenService.verifyToken(token);

      if (!tokenData) {
        throw new BadRequestException('please provide a valid JWT token');
      }

      res.locals.role = tokenData.role;
      res.locals.tokenData = tokenData;
      next();
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException(error.message);
    }
  }
}
