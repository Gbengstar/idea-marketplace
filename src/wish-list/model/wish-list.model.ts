import { Types, SchemaTypes } from 'mongoose';
import { Account } from '../../account/model/account.model';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Ads } from '../../ads/model/ads.model';

@Schema(dbSchemaOptions)
export class WishList {
  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  account: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: Ads.name })
  wishList: Types.ObjectId[];
}

export const WishListSchema = SchemaFactory.createForClass(WishList);
