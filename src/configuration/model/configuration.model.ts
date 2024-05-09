import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Configuration {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop({ default: true })
  allowReview: boolean;
}

export type ConfigurationDocument = Configuration & Document;
export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
