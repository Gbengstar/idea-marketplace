import { SchemaTypes } from 'mongoose';
import { Account } from '../../account/model/account.model';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Store } from '../../store/model/store.model';

@Schema(dbSchemaOptions)
export class Follow {
  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  account: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Store.name })
  store: string;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
