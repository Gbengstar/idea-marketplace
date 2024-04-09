import { Controller, Get, Query } from '@nestjs/common';
import { RevealService } from '../service/reveal.service';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { StringValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { AccountService } from '../../account/service/account.service';
import { stringValidator } from '../../../libs/utils/src/validator/custom.validator';

@Controller('reveal')
export class RevealController {
  constructor(
    private readonly revealService: RevealService,
    private readonly accountService: AccountService,
  ) {}

  @Get('contact')
  async getAccountContact(
    @TokenDecorator() { id }: TokenDataDto,
    @Query('account', new StringValidationPipe(stringValidator.required()))
    account: string,
  ) {
    this.revealService.createRevealLog({
      account,
      revealer: id,
      timestamp: new Date(),
    });
    return (await this.accountService.findById(account)).whatsapp;
  }

  @Get('contact-analytics')
  async getAccountContactAnalytics(@TokenDecorator() { id }: TokenDataDto) {
    return this.revealService
      .find({ account: id })
      .populate([{ path: 'revealer', select: 'whatsapp firstName lastName' }])
      .select('revealer timestamp');
  }
}
