import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbSchemaOptions } from '../../../libs/utils/src/database/config/db.config';
import { RegistrationMethodEnum } from '../enum/account.enum';
import { RolesEnum } from '../../../libs/utils/src/roles/enum/roles.enum';

@Schema(dbSchemaOptions)
export class Account {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop({ type: String })
  registrationMethod: RegistrationMethodEnum;

  @Prop({ type: String })
  role: RolesEnum;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
