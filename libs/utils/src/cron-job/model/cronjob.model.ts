import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbSchemaOptions } from '../../database/config/db.config';
import { SchemaTypes } from 'mongoose';

@Schema(dbSchemaOptions)
export class CronJob {
  @Prop({ type: SchemaTypes.ObjectId, index: true })
  cronId: string;

  @Prop()
  dateTime: Date;

  @Prop()
  eventName: string;

  @Prop({ type: SchemaTypes.Mixed })
  data: Record<string, unknown>;

  @Prop()
  isActive: boolean;
}
export const CronJoSchema = SchemaFactory.createForClass(CronJob);
