import { SchemaTypes } from 'mongoose';
import { dbSchemaOptions } from '../../../libs/utils/src/database/config/db.config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from './category.model';

@Schema(dbSchemaOptions)
export class SubCategory {
  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
  category: string;

  @Prop()
  name: string;

  @Prop()
  icon: string;

  @Prop()
  position: number;

  @Prop({ select: false })
  hidden: boolean;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);
