import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Configuration,
  ConfigurationDocument,
} from '../model/configuration.model';
import { Model } from 'mongoose';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigurationEventEnum } from '../dto/configuration.dto';

@Injectable()
export class ConfigurationService extends BaseService<Configuration> {
  private readonly logger = new Logger(ConfigurationService.name);
  constructor(
    @InjectModel(Configuration.name)
    private readonly ConfigurationModel: Model<Configuration>,
  ) {
    super(ConfigurationModel);
  }
  @OnEvent(ConfigurationEventEnum.CREATE_CONFIGURATION_EVENT)
  async findOrCreateConfiguration(account: string) {
    let config: ConfigurationDocument;
    try {
      config = await this.findOneOrErrorOut({ account });
      this.logger.log('configuration account already exist');
    } catch (error) {
      config = await this.create({ account });
      this.logger.log('configuration account created successfully');
    }

    return config;
  }

  async getConfiguration(key: keyof Configuration, account: string) {
    const config = await this.findOneOrErrorOut({ account });
    return config[key];
  }
}
