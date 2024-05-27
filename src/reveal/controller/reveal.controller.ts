import { Controller, Get, Query } from '@nestjs/common';
import { RevealService } from '../service/reveal.service';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { AccountService } from '../../account/service/account.service';
import { RevealContactDto } from '../dto/reveal.dto';
import { createRevealLogValidator } from '../validator/reveal.validator';

@Controller('reveal')
export class RevealController {
  constructor(
    private readonly revealService: RevealService,
    private readonly accountService: AccountService,
  ) {}

  @Get('contact')
  async getAccountContact(
    @TokenDecorator() { id }: TokenDataDto,
    @Query(new ObjectValidationPipe(createRevealLogValidator.required()))
    createLogData: RevealContactDto,
  ) {
    this.revealService.createRevealLog({
      account: createLogData.account,
      revealer: id,
      item: createLogData.item,
      resource: createLogData.resource,
      timestamp: new Date(),
    });
    return (
      (await this.accountService.findById(createLogData.account))?.whatsapp ??
      null
    );
  }

  @Get('contact-analytics')
  async getAccountContactAnalytics(@TokenDecorator() { id }: TokenDataDto) {
    return this.revealService
      .find({ account: id })
      .populate([{ path: 'revealer', select: 'whatsapp firstName lastName' }])
      .select('revealer timestamp');
  }
}
