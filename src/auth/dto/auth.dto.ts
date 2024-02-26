import { Account } from '../../account/model/account.model';

export type LocalSignUpDto = Pick<Account, 'email'>;

export type LocalLoginDto = Pick<Account, 'email' | 'password'>;
