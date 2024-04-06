import { SchemaTypes } from 'mongoose';
import { ReviewRatingEnum } from '../enum/review.enum';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Review {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop()
  item: string;

  @Prop({ type: Number })
  rating: ReviewRatingEnum;

  @Prop([String])
  comment: string[];

  @Prop([String])
  reply: string[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
