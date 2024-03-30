import { PromotionEventData } from './../dto/promotion.dto';
import { PromotionConfigurationService } from './promotion-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { AccountPromotion } from '../model/account-promotion.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CronJobService } from '../../../libs/utils/src/cron-job/service/cron-job.service';
import { CronJob } from '../../../libs/utils/src/cron-job/model/cronjob.model';
import { OnEvent } from '@nestjs/event-emitter';
import { PromotionEventsEnum, PromotionTypeEnum } from '../enum/promotion.enum';
import { AdsService } from '../../ads/service/ads.service';
import { JobService } from '../../job/service/job.service';
import { Promotion } from '../model/promotion.model';
import { TalentService } from '../../talent/service/talent.service';
import { Types } from 'mongoose';

@Injectable()
export class AccountPromotionService extends BaseService<AccountPromotion> {
  private readonly logger = new Logger(AccountPromotionService.name);
  constructor(
    @InjectModel(AccountPromotion.name)
    private readonly AccountPromotionModel: Model<AccountPromotion>,
    private readonly cronJobService: CronJobService,
    private readonly adsService: AdsService,
    private readonly jobsService: JobService,
    private readonly talentService: TalentService,
    private readonly promotionConfigurationService: PromotionConfigurationService,
  ) {
    super(AccountPromotionModel);
    this.cronJobService.initCronJob(this.logger, {
      isActive: true,
    });
  }
  async lastSubscription(account: string) {
    return this.AccountPromotionModel.findOne({
      account,
    })
      .populate([{ path: 'promotion', select: 'amount name' }])
      .sort({ createdAt: -1 });
  }

  async runPromotion(account: string) {
    this.logger.log(this.runPromotion.name + ' function starts running');
    const subscription = await this.lastSubscription(account);

    const promotion = subscription.promotion as unknown as Promotion;
    const publishedDate = new Date();

    if (promotion.name !== PromotionTypeEnum.QUICKIE) {
      await Promise.all([
        this.adsService.updateMany({ account }, { publishedDate }),
        this.jobsService.updateMany({ account }, { publishedDate }),
        this.talentService.updateMany({ account }, { publishedDate }),
      ]);
    }

    if (promotion.name === PromotionTypeEnum.QUICKIE) {
      const quickieFilter = { _id: { $in: subscription.promotionItems } };

      await Promise.all([
        this.adsService.updateMany(quickieFilter, { publishedDate }),
        this.jobsService.updateMany(quickieFilter, { publishedDate }),
        this.talentService.updateMany(quickieFilter, { publishedDate }),
      ]);
    }

    this.logger.log(this.runPromotion.name + ' function finished running');
  }

  nextPromotionDate(renewTimeMilliseconds: number) {
    return new Date(new Date().getTime() + renewTimeMilliseconds);
  }

  async startPromotion(account: string) {
    this.logger.log(this.startPromotion.name + ' function starts running');

    const subscription = await this.lastSubscription(account);
    const promotion = subscription.promotion as unknown as Promotion;
    const promotionConfig = this.promotionConfigurationService.get(
      promotion.name,
    );

    const nextPromotion = this.nextPromotionDate(
      promotionConfig.renewTimeMilliseconds,
    );

    const promotionEventData: PromotionEventData = {
      dueDate: subscription.dueDate,
      account,
      renewTimeMilliseconds: promotionConfig.renewTimeMilliseconds,
    };
    const data: CronJob = {
      cronId: new Types.ObjectId().toString(),
      dateTime: nextPromotion,
      eventName: PromotionEventsEnum.CONTINUE_ACCOUNT_PROMOTION_EVENT,
      data: promotionEventData,
      isActive: true,
    };

    this.runPromotion(account);
    this.continuePromotion(data);

    this.logger.log(this.startPromotion.name + ' function finished running');
  }

  endPromotion() {
    // this.cronJobService.addCronJob(data);
  }

  private continuePromotion(data: CronJob) {
    const { dueDate, renewTimeMilliseconds } =
      data.data as unknown as PromotionEventData;
    const nextCronData = { ...data };
    if (Date.now() <= new Date(dueDate).getTime()) {
      nextCronData.dateTime = this.nextPromotionDate(renewTimeMilliseconds);
      nextCronData.cronId = new Types.ObjectId().toString();
      this.cronJobService.addCronJob(nextCronData);
      return;
    }

    this.logger.log(this.continuePromotion.name + ' function FAILED TO RUN');
  }

  @OnEvent(PromotionEventsEnum.CONTINUE_ACCOUNT_PROMOTION_EVENT)
  async continueAccountPromotion(data: CronJob) {
    // update the cron job as done
    await this.cronJobService.updateOne(
      { cronId: data.cronId },
      { isActive: false },
    );

    this.logger.log(
      this.continueAccountPromotion.name + ' function starts running',
    );
    const { account, renewTimeMilliseconds } =
      data.data as unknown as PromotionEventData;

    data.dateTime = this.nextPromotionDate(renewTimeMilliseconds);
    data.cronId = new Types.ObjectId().toString();
    this.continuePromotion(data);
    this.runPromotion(account);

    this.logger.log(
      this.continueAccountPromotion.name + ' function finished running',
    );
  }

  @OnEvent(PromotionEventsEnum.END_ACCOUNT_PROMOTION_EVENT)
  endAccountPromotion() {
    //
  }
}
