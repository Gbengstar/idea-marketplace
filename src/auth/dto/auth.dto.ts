import { Account } from '../../account/model/account.model';

export type LocalSignUpDto = Pick<Account, 'email' | 'password'>;
