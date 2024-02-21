import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../libs/utils/src/database/service/db.service';
import { Account } from '../model/account.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AccountService extends BaseService<Account> {
  constructor(
    @InjectModel(Account.name) private readonly AccountModel: Model<Account>,
  ) {
    super(AccountModel);
  }

  createAccount(data: Account) {
    return this.create(data);
  }
}
