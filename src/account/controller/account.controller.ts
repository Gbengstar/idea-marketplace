import { TokenDataDto } from './../../../libs/utils/src/token/dto/token.dto';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { updateAccountDetails } from '../validator/account.validator';
import { Account } from '../model/account.model';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAccount(@TokenDecorator() { id }: TokenDataDto) {
    return this.accountService.findById(id);
  }

  @Patch()
  async updateAccount(
    @Body(new ObjectValidationPipe(updateAccountDetails)) account: Account,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    await this.accountService.updateByIdErrorOut(id, account);
    return { message: 'profile updated' };
  }
}
