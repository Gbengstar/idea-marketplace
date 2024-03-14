import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';

@Injectable()
export class CreateStoreGuard implements CanActivate {
  constructor(private readonly storeService: StoreService) {}
  async canActivate(context: ExecutionContext) {
    const res = context.switchToHttp().getResponse();
    const { id: account } = res.locals.tokenData as TokenDataDto;

    if (await this.storeService.findOne({ account })) {
      throw new BadRequestException('store already created');
    }
    return true;
  }
}

@Injectable()
export class UpdateStoreGuard implements CanActivate {
  constructor(private readonly storeService: StoreService) {}
  async canActivate(context: ExecutionContext) {
    const res = context.switchToHttp().getResponse();
    const { id: account } = res.locals.tokenData as TokenDataDto;

    if (!(await this.storeService.findOne({ account }))) {
      throw new BadRequestException('store has not being created');
    }
    return true;
  }
}
