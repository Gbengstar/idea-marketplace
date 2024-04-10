import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { View } from '../model/view.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { ViewEventEnum } from '../enum/view.enum';

@Injectable()
export class ViewService extends BaseService<View> {
  private readonly logger = new Logger(ViewService.name);

  constructor(@InjectModel(View.name) private readonly ViewModel: Model<View>) {
    super(ViewModel);
  }
  @OnEvent(ViewEventEnum.CREATE_VIEW_EVENT, { suppressErrors: true })
  private async createView(view: View) {
    try {
      const newView = new this.model(view);
      const item = (
        await newView.populate([{ path: 'item', select: 'account' }])
      ).item as unknown as { account: string };

      newView.account = item.account;
      await newView.save();
    } catch (CreateViewError) {
      this.logger.error({ CreateViewError });
    }
  }
}
