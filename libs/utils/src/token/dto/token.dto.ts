import { RolesEnum } from '@app/utils/roles/enum/roles.enum';

export type TokenDataDto = {
  id: string;
  role: RolesEnum;
  email: string;
};
