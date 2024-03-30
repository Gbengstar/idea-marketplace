import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronJob, CronJoSchema } from './model/cronjob.model';
import { CronJobService } from './service/cron-job.service';

@Global()
@Module({
  providers: [CronJobService],
  exports: [CronJobService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: CronJob.name, useFactory: () => CronJoSchema },
    ]),
  ],
})
export class CronJobModule {}
