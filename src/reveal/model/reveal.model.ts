import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  id: false,
  autoIndex: true,
  timeseries: {
    timeField: 'timestamp',
    granularity: 'hours',
  },
})
export class RevealLog {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  revealer: string;

  @Prop({ type: Date })
  timestamp: Date;
}

export const RevealLogSchema = SchemaFactory.createForClass(RevealLog);
