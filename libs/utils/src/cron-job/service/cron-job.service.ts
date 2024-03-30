import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CronJob } from '../model/cronjob.model';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob as Cron } from 'cron';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseService } from '../../database/service/db.service';

@Injectable()
export class CronJobService extends BaseService<CronJob> {
  private readonly logger = new Logger(CronJobService.name);
  constructor(
    @InjectModel(CronJob.name)
    private readonly CronJobModel: Model<CronJob>,
    private schedulerRegistry: SchedulerRegistry,
    private eventEmitter: EventEmitter2,
  ) {
    super(CronJobModel);
    // this.initCronJob();
  }

  async addCronJob(cronData: CronJob) {
    try {
      this.logger.log(this.addCronJob.name + ' function starts running');
      cronData.isActive = true;
      await this.create(cronData);

      //  register a cron job that emit an event
      const job = new Cron(cronData.dateTime, () => {
        this.eventEmitter.emit(cronData.eventName, cronData);
      });

      if (
        this.schedulerRegistry.doesExist('cron', cronData.cronId.toString())
      ) {
        this.schedulerRegistry.deleteCronJob(cronData.cronId.toString());
      }
      this.schedulerRegistry.addCronJob(cronData.cronId.toString(), job);
      job.start();

      this.logger.log(this.addCronJob.name + ' function end');
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async getActiveCronJobs(filterQuery?: FilterQuery<CronJob>) {
    const filter = filterQuery || {
      isActive: true,
      dateTime: { $gte: new Date() },
    };
    return this.CronJobModel.find(filter);
  }

  async findCronJobsByDescription(description: string) {
    return this.CronJobModel.find({
      description,
    });
  }

  async deleteCron(name: string) {
    if (this.schedulerRegistry.doesExist('cron', name)) {
      this.schedulerRegistry.deleteCronJob(name);
      await this.CronJobModel.findOneAndDelete({ name: name });
    }
  }

  async initCronJob(logger: Logger, filterQuery?: FilterQuery<CronJob>) {
    const cronJobs = await this.getActiveCronJobs(filterQuery);

    let count = 0;
    for await (const cronJob of cronJobs) {
      cronJob.cronId = new Types.ObjectId().toString();
      await this.addCronJob(cronJob);
      count++;
    }
    logger.log({ cronJobs });
    logger.log('All cron jobs initiated successfully');
    logger.log(`${count} number of cron jobs restarted`);
  }
}
