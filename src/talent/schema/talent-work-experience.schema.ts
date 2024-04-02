import { dbSchemaOptions } from '../../../libs/utils/src/database/config/db.config';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class WorkExperience {
  @Prop()
  company: string;

  @Prop()
  position: string;

  @Prop()
  locationType: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  country: string;

  @Prop()
  state: string;

  @Prop()
  description: string;
}
