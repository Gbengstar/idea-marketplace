import { dbSchemaOptions } from './../../database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema(dbSchemaOptions)
export class Otp {
  @Prop({ index: true })
  email: string;

  @Prop()
  code: string;

  @Prop()
  expirationDate: Date;
}

export type OtpDocument = Otp & mongoose.Document;

export const OtpSchema = SchemaFactory.createForClass(Otp);
