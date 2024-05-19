import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Configuration {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop({ default: true })
  allowReview: boolean;

  @Prop({ default: true })
  wishList: boolean;

  @Prop({ default: true })
  phoneNumberClick: boolean;

  @Prop({ default: true })
  whatsAppClick: boolean;

  @Prop({ default: true })
  following: boolean;
}

export type ConfigurationDocument = Configuration & Document;
export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
