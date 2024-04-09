import { Types, SchemaTypes } from 'mongoose';
import { Account } from '../../account/model/account.model';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';

@Schema(dbSchemaOptions)
export class WishList {
  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  account: string;

  @Prop({ type: SchemaTypes.ObjectId, refPath: 'ref' })
  wish: Types.ObjectId;

  @Prop({ type: SchemaTypes.String })
  ref: ResourceEnum;
}

export const WishListSchema = SchemaFactory.createForClass(WishList);
