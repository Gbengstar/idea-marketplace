import { SchemaTypes } from 'mongoose';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Promotion } from './promotion.model';
import { Account } from '../../account/model/account.model';

@Schema(dbSchemaOptions)
export class AccountPromotion {
  @Prop({ type: SchemaTypes.ObjectId, ref: Promotion.name })
  promotion: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  account: string;

  @Prop({ type: [String] })
  promotionItems: string[];

  @Prop({ type: Date })
  dueDate: Date;
}

export const AccountPromotionSchema =
  SchemaFactory.createForClass(AccountPromotion);
