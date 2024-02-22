import { AccountService } from './../../account/service/account.service';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { LocalSignUpDto } from '../dto/auth.dto';

@Injectable()
export class AuthCheckGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const { email } = request.body as LocalSignUpDto;

    const account = await this.accountService.findOne({
      email,
      verified: true,
    });
    if (account) {
      throw new BadRequestException('account already registered and validated');
    }
    await this.accountService.deleteMany({
      email,
    });

    return true;
  }
}
