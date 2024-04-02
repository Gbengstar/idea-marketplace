import { dbSchemaOptions } from '../../../libs/utils/src/database/config/db.config';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Education {
  @Prop()
  name: string;

  @Prop()
  course: string;

  @Prop()
  degreeOrCertificate: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  country: string;

  @Prop()
  state: string;
}
