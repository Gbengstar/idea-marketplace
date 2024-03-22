import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { PromotionService } from '../service/promotion.service';
import { AccountPromotionService } from '../service/account-promotion.service';
import { Promotion } from '../model/promotion.model';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { createPromotionValidator } from '../validator/promotion.validator';

@Controller('promotion')
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly accountPromotionService: AccountPromotionService,
  ) {}

  @Post()
  createPromotion(
    @Body(new ObjectValidationPipe(createPromotionValidator))
    promotion: Promotion,
  ) {
    // return this.promotionService.create(promotion);
    return promotion;
  }

  @Get()
  getPromotion() {
    return this.promotionService.model
      .find({})
      .sort({ position: 1 })
      .select('-createdAt -updatedAt');
  }

  @Patch()
  editPromotion(@Body() { position, ...promotion }: Promotion) {
    return this.promotionService.findOneAndUpdateOrErrorOut(
      { position },
      promotion,
    );
  }

  @Post()
  purchasePromotion(@Body() promotion: Promotion) {
    return this.promotionService.create(promotion);
  }

  @Get()
  getAccountPromotion(@TokenDecorator() { id: account }: TokenDataDto) {
    return this.accountPromotionService.find({ account });
  }
}
