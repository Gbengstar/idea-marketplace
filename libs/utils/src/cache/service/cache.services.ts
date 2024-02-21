import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { EnvConfigEnum } from '@app/utils/config/env.enum';

@Injectable()
export class CacheService {
  private client;
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.getOrThrow(EnvConfigEnum.REDIS_HOST),
    })
      .on('error', (err) => Logger.error('Redis Client Error', err))
      .on('connect', () => {
        Logger.debug('connected to redis server');
      })
      .connect()
      .then((client) => {
        this.client = client;
      });
  }

  async set(key: string, value: any) {
    this.logger.debug({ key, value });
    return this.client.set(key, JSON.stringify(value));
  }

  async delete(key: string) {
    return this.client.del(key);
  }

  async get<T = any>(key: string): Promise<T> {
    return JSON.parse(await this.client.get(key));
  }

  async getOrThrowError(key: string) {
    const data = await this.client.get(key);
    if (!data)
      throw new NotFoundException(`redis failed to get value for key: ${key}`);
    return JSON.parse(data);
  }
}
