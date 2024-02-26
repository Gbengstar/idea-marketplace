import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Request Logger');

  async use(req: Request, res: Response, next: NextFunction) {
    const formattedDate = `${new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')}`;
    this.logger.log(
      `\n[${formattedDate}] Request: ${req.method} ${req.originalUrl}`,
    );
    next();
  }
}
