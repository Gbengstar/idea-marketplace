import { TokenDataDto } from './../dto/token.dto';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { EnvConfigEnum } from '@app/utils/config/env.enum';
import { Request } from 'express';

@Injectable()
export class TokenService {
  private expiresIn: string;
  private tokenSecret: string;
  private refreshTokenExpiration: string;

  constructor(private config: ConfigService) {}

  signToken(tokenData: TokenDataDto): Promise<string> {
    const tokenSecret = this.config.getOrThrow(EnvConfigEnum.TOKEN_SECRET);

    return new Promise((resolve, reject) => {
      jwt.sign(
        tokenData,
        tokenSecret,
        // { expiresIn: 2 * 24 * 60 * 60 * 1000 },
        (err, encoded: string) => {
          if (err) reject(new InternalServerErrorException(err));
          resolve(encoded);
        },
      );
    });
  }

  verifyExpiredToken(token: string) {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.getOrThrow(EnvConfigEnum.TOKEN_SECRET);
      jwt.verify(
        token,
        tokenSecret,
        { ignoreExpiration: true },
        (err, decoded) => {
          if (err) reject(new UnauthorizedException(err.message));
          resolve(decoded);
        },
      );
    });
  }

  refreshToken({
    id,
    expiresIn = this.refreshTokenExpiration,
  }: {
    id: string;
    expiresIn?: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const tokenSecret = this.config.get(EnvConfigEnum.REFRESH_TOKEN_SECRET);

      jwt.sign({ id }, tokenSecret, { expiresIn }, (err, decoded) => {
        if (err) reject(new InternalServerErrorException(err));

        resolve(decoded);
      });
    });
  }

  async verifyRefreshToken(token: string): Promise<any> {
    const tokenSecret = this.config.get(EnvConfigEnum.REFRESH_TOKEN_SECRET);
    try {
      const decoded = await jwt.decode(token, tokenSecret);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  verifyToken(token: string): Promise<TokenDataDto> {
    return new Promise((resolve) => {
      const tokenSecret = this.config.getOrThrow(EnvConfigEnum.TOKEN_SECRET);

      jwt.verify(token, tokenSecret, (err, decoded: TokenDataDto) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            throw new HttpException(
              {
                status: 451,
                message: 'token expired',
              },
              451,
            );
          }
          throw new BadRequestException(err.message);
        }
        resolve(decoded);
      });
    });
  }

  decode(token: string) {
    return jwt.decode(token, { complete: true });
  }

  static readonly getToken = (req: Request) => {
    if (!req.headers.authorization?.startsWith('Bearer')) {
      throw new BadRequestException('valid authorization token is required');
    }
    const authorizationHeader = req.headers.authorization;
    const [, token] = authorizationHeader.split(' ');

    if (!token) {
      throw new BadRequestException('please provide a valid JWT token');
    }
    return token;
  };
}