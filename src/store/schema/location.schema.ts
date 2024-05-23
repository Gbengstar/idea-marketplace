import { Prop, Schema } from '@nestjs/mongoose';
import { BusinessHours } from '../dto/store.dto';
import { Types, Document } from 'mongoose';
import { WorkingDaysEnum } from '../enum/store.enum';

@Schema()
export class Location {
  @Prop()
  storeName: string;

  @Prop()
  region: string;

  @Prop()
  address: string;

  @Prop({ type: [String], default: [] })
  workingDays: WorkingDaysEnum[];

  @Prop({ type: { from: String, to: String } })
  businessHours: BusinessHours;
}

export type LocationDocument = Location & Document<Types.ObjectId>;
