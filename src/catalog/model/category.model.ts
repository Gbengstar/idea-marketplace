import { dbSchemaOptions } from './../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema(dbSchemaOptions)
export class Category {
  @Prop()
  name: string;

  @Prop()
  icon: string;

  @Prop()
  position: number;

  @Prop({ select: false })
  hidden: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
