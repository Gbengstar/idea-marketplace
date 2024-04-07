import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  id: false,
  autoIndex: true,
  timeseries: {
    timeField: 'timestamp',
    metaField: 'account',
    granularity: 'hours',
  },
})
export class View {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop({ type: Date })
  timestamp: Date;
}

export const ViewSchema = SchemaFactory.createForClass(View);
