import { SchemaTypes } from 'mongoose';
import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Comment {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop()
  comment: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
