import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getDatabaseConnection(): Connection {
    this.logger.log('database connection returned');
    return this.connection;
  }
}
