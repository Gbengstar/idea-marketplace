import { OtpService } from './../../../libs/utils/src/otp/services/otp.service';
import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TokenService } from '../../../libs/utils/src/token/service/token.service';
import { GoogleStrategyService } from '../../../libs/utils/src/auth-strategy/service/google-strategy.service';
import { RolesEnum } from '../../../libs/utils/src/roles/enum/roles.enum';
import { AccountService } from '../../account/service/account.service';
import { RegistrationMethodEnum } from '../../account/enum/account.enum';
import {
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import { randomInt } from 'crypto';
import { verifyOtpByEmailValidator } from '../../../libs/utils/src/otp/validators/otp.validator';
import { VerifyOtpByEmailDto } from '../../../libs/utils/src/otp/dto/otp.dto';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { localSignUpValidator } from '../validator/auth.validator';
import { LocalLoginDto, LocalSignUpDto } from '../dto/auth.dto';
import {
  hash,
  verifyHash,
} from '../../../libs/utils/src/general/function/password.function';
import { AuthCheckGuard } from '../guard/auth.guard';
import { passwordValidator } from '../../../libs/utils/src/validator/password.validator';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';

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

    const accountData = {
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
    { email }: LocalSignUpDto,
  ) {
    const session = await this.accountService.getSession();
    try {
      const accountData = {
        email,
        firstName: '',
        lastName: '',
        registrationMethod: RegistrationMethodEnum.LOCAL,
        role: RolesEnum.VENDOR,
        password: '',
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

      return {
        message: 'OTP sent to email',
        code: this.otpService.voidForProductionEnv(code),
      };
    } catch (error) {
      session.abortTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException();
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

  @Post('send-otp')
  async sendOtp(
    @Body(new ObjectValidationPipe(localSignUpValidator))
    { email }: LocalSignUpDto,
  ) {
    const code = randomInt(10000, 99999);

    await this.otpService.hashAndSaveOtp({ email, code: String(code) });

    //TODO send otp to email

    return {
      message: 'OTP sent to email',
      code: this.otpService.voidForProductionEnv(code),
    };
  }

  @Post('change-password')
  async changePassword(
    @Body('password', new StringValidationPipe(passwordValidator))
    password: string,
    @TokenDecorator() { id }: TokenDataDto,
  ) {
    await this.accountService.findByIdAndUpdateOrErrorOut(id, {
      $set: { password: await hash(password) },
    });

    return { message: 'password updated' };
  }

  @Post('vendor/local-login')
  async localLogin(
    @Body(new ObjectValidationPipe(localSignUpValidator))
    { email, password }: LocalLoginDto,
  ) {
    const account = await this.accountService.findOneOrErrorOut({ email });

    if (account.registrationMethod !== RegistrationMethodEnum.LOCAL) {
      throw new BadRequestException(
        `please login with your ${account.registrationMethod} account`,
      );
    }

    if (!account.verified) {
      throw new BadRequestException('please verify your account');
    }

    if (!account.password) {
      throw new BadRequestException(
        'please verify your account and update your password',
      );
    }
    this.logger.debug({ account });

    const correctPassword = await verifyHash(account.password, password);
    if (!correctPassword) {
      throw new UnauthorizedException('invalid email or password');
    }

    const tokenData: TokenDataDto = {
      id: account._id.toString(),
      role: account.role,
      email: account.email,
    };

    const accessToken = await this.tokenService.signToken(tokenData);

    return { accessToken, account };
  }
}
