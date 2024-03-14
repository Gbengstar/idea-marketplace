import { Account } from '../../account/model/account.model';

export type LocalSignUpDto = Pick<
  Account,
  'email' | 'firstName' | 'lastName' | 'whatsapp'
>;

export type LocalLoginDto = Pick<Account, 'email' | 'password'>;

export type GoogleSignUpDto = { token: string };
