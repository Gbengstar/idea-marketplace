import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Review {
  @Prop()
  ads: string;

  @Prop()
  comment: string;

  @Prop()
  reply: string;

  @Prop()
  rating: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
