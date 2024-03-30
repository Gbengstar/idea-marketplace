import { SchemaTypes } from 'mongoose';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Education {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop()
  photo: string;

  @Prop()
  name: string;
}
