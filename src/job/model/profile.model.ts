import { SchemaTypes } from 'mongoose';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Profile {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account', index: true })
  account: string;

  @Prop()
  photo: string;

  @Prop()
  businessName: string;

  @Prop()
  website: string;

  @Prop()
  nationality: string;

  @Prop()
  state: string;

  @Prop()
  city: string;

  @Prop()
  address: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
