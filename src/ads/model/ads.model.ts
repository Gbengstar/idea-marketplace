import { Document, Types, SchemaTypes } from 'mongoose';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Ads {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Store' })
  store: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' })
  category: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'SubCategory' })
  subCategory: string;

  @Prop()
  typeOfOwner: string;

  @Prop()
  brandName: string;

  @Prop()
  productOption: string;

  @Prop()
  condition: string;

  @Prop({ type: [String] })
  glance: string[];

  @Prop({ type: [String] })
  peculiarities: string[];

  @Prop()
  price: number;

  @Prop()
  negotiable: boolean;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  hidden: boolean;

  @Prop({ default: false })
  wish: boolean;

  @Prop({ default: true })
  available: boolean;

  @Prop()
  publishedDate: Date;

  @Prop()
  status: string;
}

export type AdsDocument = Ads & Document<Types.ObjectId>;

export const AdsSchema = SchemaFactory.createForClass(Ads);
