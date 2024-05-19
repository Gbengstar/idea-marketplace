import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import { NotificationTypeEnum } from '../dto/notification.dto';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: string;

  @Prop({ type: SchemaTypes.ObjectId, refPath: 'reference' })
  item: string;

  @Prop({ type: SchemaTypes.String })
  reference: ResourceEnum;

  @Prop({ type: SchemaTypes.String })
  notification: string;

  @Prop({ type: SchemaTypes.String, enum: NotificationTypeEnum })
  notificationType: NotificationTypeEnum;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
