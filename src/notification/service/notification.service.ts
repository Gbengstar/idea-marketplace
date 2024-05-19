import { ConfigurationService } from './../../configuration/service/configuration.service';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Notification } from '../model/notification.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  constructor(
    @InjectModel(Notification.name)
    private readonly NotificationModel: Model<Notification>,
    private readonly configurationService: ConfigurationService,
  ) {
    super(NotificationModel);
  }

  async createStoreFollowerNotification(account: string) {
    const config = await this.configurationService.getConfiguration(
      'following',
      account,
    );

    if (!config) return;

    // TODO send email

    // send in-app notification
  }
}
