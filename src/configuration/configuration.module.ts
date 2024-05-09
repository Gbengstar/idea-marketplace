import { Global, Module } from '@nestjs/common';
import { ConfigurationService } from './service/configuration.service';
import { ConfigurationController } from './controller/configuration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Configuration,
  ConfigurationSchema,
} from './model/configuration.model';

@Global()
@Module({
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Configuration.name, useFactory: () => ConfigurationSchema },
    ]),
  ],
})
export class ConfigurationModule {}
