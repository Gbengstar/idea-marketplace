import { dbSchemaOptions } from '../../../libs/utils/src/database/config/db.config';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Certification {
  @Prop()
  name: string;

  @Prop()
  provider: string;

  @Prop()
  issuedDate: Date;

  @Prop()
  certificateIdOrUrl: string;

  @Prop()
  description: string;
}
