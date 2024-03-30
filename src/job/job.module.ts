import { Module } from '@nestjs/common';
import { JobService } from './service/job.service';
import { JobController } from './controller/job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './model/profile.model';
import { Job, JobSchema } from './model/job.model';
import { ProfileService } from './service/profile.service';

@Module({
  controllers: [JobController],
  providers: [JobService, ProfileService],
  exports: [JobService, ProfileService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Profile.name, useFactory: () => ProfileSchema },
      { name: Job.name, useFactory: () => JobSchema },
    ]),
  ],
})
export class JobModule {}
