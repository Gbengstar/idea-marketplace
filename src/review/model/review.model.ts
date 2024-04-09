import { SchemaTypes } from 'mongoose';
import { ReviewRatingEnum } from '../enum/review.enum';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';

@Schema(dbSchemaOptions)
export class Review {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  reviewer: string;

  @Prop({ type: SchemaTypes.ObjectId, refPath: 'ref' })
  item: string;

  @Prop({ type: SchemaTypes.String })
  ref: ResourceEnum;

  @Prop({ type: Number })
  rating: ReviewRatingEnum;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Comment' })
  comment: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Comment' })
  reply: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
