import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';

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

  @Prop({ type: SchemaTypes.ObjectId, refPath: 'resource' })
  item: string;

  @Prop({ type: SchemaTypes.String })
  resource: ResourceEnum;

  @Prop({ type: Date })
  timestamp: Date;
}

export const RevealLogSchema = SchemaFactory.createForClass(RevealLog);
