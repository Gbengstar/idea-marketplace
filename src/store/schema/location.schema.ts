import { Prop, Schema } from '@nestjs/mongoose';
import { dbSchemaOptions } from '../../../libs/utils/src/database/config/db.config';
import { BusinessHours } from '../dto/store.dto';

@Schema(dbSchemaOptions)
export class Location {
  @Prop()
  storeName: string;

  @Prop()
  region: string;

  @Prop()
  address: string;

  @Prop()
  workingDays: string;

  @Prop({ type: { from: String, To: String } })
  businessHours: BusinessHours;
}
