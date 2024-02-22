import { OtpService } from './../../../libs/utils/src/otp/services/otp.service';
import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService } from '../../../libs/utils/src/token/service/token.service';
import { GoogleStrategyService } from '../../../libs/utils/src/auth-strategy/service/google-strategy.service';
import { RolesEnum } from '../../../libs/utils/src/roles/enum/roles.enum';
import { AccountService } from '../../account/service/account.service';
import { Account } from '../../account/model/account.model';
import { RegistrationMethodEnum } from '../../account/enum/account.enum';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import { randomInt } from 'crypto';
import { verifyOtpByEmailValidator } from '../../../libs/utils/src/otp/validators/otp.validator';
import { VerifyOtpByEmailDto } from '../../../libs/utils/src/otp/dto/otp.dto';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { localSignUpValidator } from '../validator/auth.validator';
import { LocalSignUpDto } from '../dto/auth.dto';
import { hash } from '../../../libs/utils/src/general/function/password.function';
import { AuthCheckGuard } from '../guard/auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly accountService: AccountService,
    private readonly googleStrategyService: GoogleStrategyService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('vendor/google-sign-up')
  @UseGuards(AuthCheckGuard, AuthGuard('google'))
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
      password: '',
      verified: false,
    };

    const code = randomInt(10000, 99999);

    const clientSession = await this.accountService.getSession();
    await clientSession.withTransaction(async (session) => {
      await Promise.all([
        this.accountService.createWithSession([{ ...accountData }], session),
        this.otpService.createWithSession(
          [{ email: googleData.email, code: String(code) }],
          session,
        ),
      ]);
    });

    // TODO send OTP to email

    return {
      message: 'account successfully created, token sent to email',
      code: this.otpService.voidForProductionEnv(code),
    };
  }

  @Post('vendor/local-sign-up')
  @UseGuards(AuthCheckGuard)
  async localSignUp(
    @Body(new ObjectValidationPipe(localSignUpValidator))
    { email, password }: LocalSignUpDto,
  ) {
    const session = await this.accountService.getSession();
    try {
      const accountData: Account = {
        email,
        firstName: '',
        lastName: '',
        registrationMethod: RegistrationMethodEnum.LOCAL,
        role: RolesEnum.VENDOR,
        password: await hash(password),
        verified: false,
      };

      const code = randomInt(10000, 99999);

      await session.withTransaction(async () => {
        await this.accountService.createWithSession(
          [{ ...accountData }],
          session,
        );
        await this.otpService.hashAndSaveOtp(
          { email, code: String(code) },
          session,
        );
      });

      // TODO send OTP to email

      return Promise.resolve({
        message: 'account successfully created, token sent to email',
        code: this.otpService.voidForProductionEnv(code),
      });
    } catch (error) {
      session.abortTransaction();
      this.logger.error(error);
    }
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body(new ObjectValidationPipe(verifyOtpByEmailValidator))
    { email, code }: VerifyOtpByEmailDto,
  ) {
    const [account] = await Promise.all([
      this.accountService.findOneOrErrorOut({ email }),
      this.otpService.verifyHashedOtp({ email, code }),
    ]);

    const tokenData: TokenDataDto = {
      id: account._id.toString(),
      role: account.role,
      email: account.email,
    };

    account.verified = true;

    const [accessToken] = await Promise.all([
      this.tokenService.signToken(tokenData),
      account.save(),
    ]);

    return { accessToken };
  }

  @Post('vendor/local-login')
  async localLogin(
    @Body(new ObjectValidationPipe(localSignUpValidator))
    { email, password }: LocalSignUpDto,
  ) {
    const accountData: Account = {
      email,
      firstName: '',
      lastName: '',
      registrationMethod: RegistrationMethodEnum.GOOGLE,
      role: RolesEnum.VENDOR,
      password: await hash(password),
      verified: false,
    };

    const code = randomInt(10000, 99999);

    const clientSession = await this.accountService.getSession();
    await clientSession.withTransaction(async (session) => {
      await this.accountService.createWithSession(
        [{ ...accountData }],
        session,
      );

      await this.otpService.createWithSession(
        [{ email, code: String(code) }],
        session,
      );
    });

    // TODO send OTP to email

    return {
      message: 'account successfully created, token sent to email',
      code: this.otpService.voidForProductionEnv(code),
    };
  }
}
