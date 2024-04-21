import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { FollowService } from '../service/follow.service';
import { StringValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  async followStore(
    @Body('store', new StringValidationPipe(objectIdValidator.required()))
    store: string,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    const follow = await this.followService.findOne({ account, store });
    if (follow) return follow;
    return this.followService.create({ account, store });
  }

  @Patch()
  unFollowStore(
    @Body('store', new StringValidationPipe(objectIdValidator.required()))
    store: string,
    @TokenDecorator() { id: account }: TokenDataDto,
  ) {
    return this.followService.deleteMany({ account, store });
  }

  @Get('account')
  following(@TokenDecorator() { id: account }: TokenDataDto) {
    return this.followService.find({ account }, [{ path: 'store' }]);
  }

  @Get('/:store')
  storeFollows(
    @Param('store', new StringValidationPipe(objectIdValidator.required()))
    store: string,
  ) {
    return this.followService.find({ store }, [
      { path: 'account', select: 'firstName lastName email whatsapp' },
    ]);
  }
}
