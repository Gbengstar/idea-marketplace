import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';

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

  @Prop({ type: SchemaTypes.ObjectId, refPath: 'reference' })
  item: string;

  @Prop({ type: SchemaTypes.String })
  reference: ResourceEnum;

  @Prop({ type: Date })
  timestamp: Date;
}

export const ViewSchema = SchemaFactory.createForClass(View);
