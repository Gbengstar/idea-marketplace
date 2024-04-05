import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbSchemaOptions } from '../../../libs/utils/src/database/config/db.config';
import { RegistrationMethodEnum } from '../enum/account.enum';
import { RolesEnum } from '../../../libs/utils/src/roles/enum/roles.enum';
import { SchemaTypes } from 'mongoose';
import { Store } from '../../store/model/store.model';

@Schema(dbSchemaOptions)
export class Account {
  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ index: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: '' })
  photo: string;

  @Prop({ default: '' })
  whatsapp: string;

  @Prop({ type: Boolean })
  verified: boolean;

  @Prop({ type: String })
  registrationMethod: RegistrationMethodEnum;

  @Prop({ type: String })
  role: RolesEnum;

  @Prop({ type: String })
  resetPasswordToken: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Store.name })
  store: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
