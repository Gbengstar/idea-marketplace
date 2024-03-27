import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from '../model/job.model';

@Injectable()
export class JobService extends BaseService<Job> {
  private readonly logger = new Logger(Job.name);
  constructor(@InjectModel(Job.name) private readonly JobModel: Model<Job>) {
    super(JobModel);
  }
}
