import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { RevealLog } from '../model/reveal.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RevealEventsEnum } from '../enum/reveal.enum';

@Injectable()
export class RevealService extends BaseService<RevealLog> {
  private readonly logger = new Logger(RevealService.name);
  constructor(
    @InjectModel(RevealLog.name)
    private readonly RevealLogModel: Model<RevealLog>,
    private readonly EventEmitter: EventEmitter2,
  ) {
    super(RevealLogModel);
  }

  createRevealLog(revealData: RevealLog) {
    this.EventEmitter.emit(RevealEventsEnum.CREATE_REVEAL_EVENT, revealData);
  }

  @OnEvent(RevealEventsEnum.CREATE_REVEAL_EVENT)
  private async createRevealLogEvent(reveal: RevealLog) {
    await this.deleteMany({
      account: reveal.account,
      revealer: reveal.revealer,
    });

    this.create(reveal)
      .catch((createRevealEventLogError) =>
        this.logger.error({ createRevealEventLogError }),
      )
      .then((revealLogData) => this.logger.log({ revealLogData }));
  }
}
