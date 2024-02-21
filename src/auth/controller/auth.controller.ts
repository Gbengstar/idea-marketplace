import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService } from '../../../libs/utils/src/token/service/token.service';
import { GoogleStrategyService } from '../../../libs/utils/src/auth-strategy/service/google-strategy.service';
import { RolesEnum } from '../../../libs/utils/src/roles/enum/roles.enum';
import { AccountService } from '../../account/service/account.service';
import { Account } from '../../account/model/account.model';
import { RegistrationMethodEnum } from '../../account/enum/account.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly accountService: AccountService,
    private readonly googleStrategyService: GoogleStrategyService,
  ) {}

  @Post('vendor/google-sign-up')
  @UseGuards(AuthGuard('google'))
  async googleSignUp(@Req() req: Request) {
    const token = TokenService.getToken(req);
    const googleData = await this.googleStrategyService.verifyGoogleToken(
      token,
    );

    const accountData: Account = {
      email: googleData.email,
      firstName: googleData.given_name,
      lastName: googleData.family_name,
      registrationMethod: RegistrationMethodEnum.GOOGLE,
      role: RolesEnum.VENDOR,
    };

    await this.accountService.createAccount(accountData);

    return { message: 'account successfully created, token sent to email' };
  }
}
