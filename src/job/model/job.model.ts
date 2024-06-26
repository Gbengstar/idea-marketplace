import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { JobSalaryRange } from '../dto/job.dto';
import { JobLocationTypeEnum, JobTypeEnum } from '../enum/job.enum';
import { ResourceStatusEnum } from '../../../libs/utils/src/dto/resource.dto';

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Profile' })
  profile: string;

  @Prop()
  jobTitle: string;

  @Prop({ type: { max: Number, min: Number } })
  salaryRange: JobSalaryRange;

  @Prop({ type: String })
  locationType: JobLocationTypeEnum;

  @Prop({ type: String })
  jobType: JobTypeEnum;

  @Prop()
  nationality: string;

  @Prop()
  applicationUrl: string;

  @Prop()
  expirationDate: Date;

  @Prop()
  description: string;

  @Prop()
  publishedDate: Date;

  @Prop({ type: String })
  status: ResourceStatusEnum;
}

export const JobSchema = SchemaFactory.createForClass(Job);
