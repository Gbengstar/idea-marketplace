import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbSchemaOptions } from '../../../libs/utils/src/database/config/db.config';
import { SchemaTypes } from 'mongoose';
import { Location } from '../schema/location.schema';

@Schema(dbSchemaOptions)
export class Store {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account', index: true })
  account: string;

  @Prop()
  photo: string;

  @Prop()
  businessName: string;

  @Prop()
  description: string;

  @Prop()
  website: string;

  @Prop({ type: [String] })
  languages: string[];

  @Prop({ type: [Location] })
  locations: Location[];
}

export const StoreSchema = SchemaFactory.createForClass(Store);
