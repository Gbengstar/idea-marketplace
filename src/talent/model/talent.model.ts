import { SchemaTypes } from 'mongoose';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusEnum } from '../../../libs/utils/src/enum/status.enum';
import { Education } from '../schema/talent-education.schema';
import { Certification } from '../schema/talent-certification.schema';
import { WorkExperience } from '../schema/talent-work-experience.schema';

@Schema(dbSchemaOptions)
export class Talent {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop()
  photo: string;

  @Prop()
  name: string;

  @Prop()
  portfolioUrl: string;

  @Prop()
  cv: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  skills: string[];

  @Prop({ type: [Education] })
  education: Education[];

  @Prop({ type: [WorkExperience] })
  workExperience: WorkExperience[];

  @Prop({ type: [Certification] })
  certification: Certification[];

  @Prop()
  publishedDate: Date;

  @Prop({ type: String })
  status: StatusEnum;
}

export const TalentSchema = SchemaFactory.createForClass(Talent);
