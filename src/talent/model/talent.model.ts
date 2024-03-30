import { SchemaTypes } from 'mongoose';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { StatusEnum } from '../../../libs/utils/src/enum/status.enum';

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

  @Prop()
  education: Date;

  @Prop({ type: String })
  workExperience: StatusEnum;

  @Prop({ type: String })
  certification: StatusEnum;

  @Prop()
  publishedDate: Date;
}

export const TalentSchema = SchemaFactory.createForClass(Talent);
