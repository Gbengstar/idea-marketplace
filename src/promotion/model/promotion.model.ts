import { PromotionTypeEnum } from '../enum/promotion.enum';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Promotion {
  @Prop({ type: String, unique: true })
  name: PromotionTypeEnum;

  @Prop()
  amount: number;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  features: string[];

  @Prop()
  position: number;

  @Prop({ default: false })
  popular: boolean;

  @Prop({ default: false, select: false })
  hidden: boolean;
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
