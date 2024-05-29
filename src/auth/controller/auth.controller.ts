import { EventEmitter2 } from '@nestjs/event-emitter';
import { OtpService } from './../../../libs/utils/src/otp/services/otp.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
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
import {
  googleSignUpValidator,
  localLoginValidator,
  localSignUpValidator,
} from '../validator/auth.validator';
import {
  GoogleSignUpDto,
  LocalLoginDto,
  LocalSignUpDto,
} from '../dto/auth.dto';
import {
  hash,
  verifyHash,
} from '../../../libs/utils/src/general/function/password.function';
import { AuthCheckGuard } from '../guard/auth.guard';
import { passwordValidator } from '../../../libs/utils/src/validator/password.validator';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import { emailValidator } from '../../../libs/utils/src/validator/custom.validator';
import { returnOnDev } from '../../../libs/utils/src/general/function/general.function';
import { GoogleOauthService } from '../../../libs/utils/src/google-oauth/service/google-oauth.service';
import { Response } from 'express';
import { ConfigurationEventEnum } from '../../configuration/dto/configuration.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly accountService: AccountService,
    private readonly googleStrategyService: GoogleStrategyService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
    private readonly googleOauthService: GoogleOauthService,
    private readonly EventEmitter: EventEmitter2,
  ) {}

  @Post('vendor/google-sign-up')
  // @UseGuards(AuthCheckGuard, AuthGuard('google'))
  async googleSignUp(
    @Body(new ObjectValidationPipe(googleSignUpValidator))
    { token }: GoogleSignUpDto,
  ) {
    this.logger.log({ token });

    const tokenInfo = await this.googleOauthService.getTokenInfo(token);

    this.logger.log({ tokenInfo });

    const accountData = {
      email: tokenInfo.email,
      firstName: '',
      lastName: '',
      registrationMethod: RegistrationMethodEnum.GOOGLE,
      role: RolesEnum.VENDOR,
      password: '',
      verified: false,
    };

    const account = new this.accountService.model(accountData);

    // TODO send OTP to email

    const tokenData: TokenDataDto = {
      id: account._id.toString(),
      role: account.role,
      email: account.email,
    };

    const [accessToken] = await Promise.all([
      this.tokenService.signToken(tokenData),
      account.save(),
    ]);

    return { accessToken };
  }

  @Post('vendor/local-sign-up')
  @UseGuards(AuthCheckGuard)
  async localSignUp(
    @Body(new ObjectValidationPipe(localSignUpValidator))
    data: LocalSignUpDto,
  ) {
    const session = await this.accountService.getSession();
    try {
      const accountData = {
        ...data,
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
          { email: data.email, code: String(code) },
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

    this.EventEmitter.emit(
      ConfigurationEventEnum.CREATE_CONFIGURATION_EVENT,
      account._id.toString(),
    );

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
    @Body(new ObjectValidationPipe(localLoginValidator))
    { email, password }: LocalLoginDto,
    @Res() response: Response,
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

    const correctPassword = await verifyHash(account.password, password);
    if (!correctPassword) {
      throw new UnauthorizedException(
        'Please enter a valid email and password',
      );
    }

    const tokenData: TokenDataDto = {
      id: account._id.toString(),
      role: account.role,
      email: account.email,
    };

    this.EventEmitter.emit(
      ConfigurationEventEnum.CREATE_CONFIGURATION_EVENT,
      account._id.toString(),
    );

    const accessToken = await this.tokenService.signToken(tokenData);

    response.cookie(
      'token',
      accessToken /**{ signed: true, httpOnly: true } */,
    );

    return response.json({ status: 'SUCCESS', data: { accessToken, account } });
  }

  @Post('vendor/google-login')
  async googleLogin(
    @Body(new ObjectValidationPipe(localSignUpValidator))
    { token }: GoogleSignUpDto,
  ) {
    const googleData = await this.googleOauthService.getTokenInfo(token);
    const account = await this.accountService.findOneOrErrorOut({
      email: googleData.email,
      registrationMethod: RegistrationMethodEnum.GOOGLE,
    });

    if (!account) {
      throw new BadRequestException(
        'please login with valid email and password',
      );
    }
    this.logger.debug({ account });

    const tokenData: TokenDataDto = {
      id: account._id.toString(),
      role: account.role,
      email: account.email,
    };

    const accessToken = await this.tokenService.signToken(tokenData);

    this.EventEmitter.emit(
      ConfigurationEventEnum.CREATE_CONFIGURATION_EVENT,
      account._id.toString(),
    );

    return { accessToken, account };
  }

  @Post('forget-password')
  async forgetPassword(
    @Body('email', new StringValidationPipe(emailValidator))
    email: string,
  ) {
    const account = await this.accountService.findOne({ email });
    const code = `${randomInt(100000, 999999)}`;

    if (account) {
      await this.otpService.hashAndSaveOtp({ email, code: String(code) });
    }

    const hashCode = Buffer.from(JSON.stringify({ email, code })).toString(
      'base64',
    );

    // TODO send mail

    const link = `http://localhost:3000/reset-password?${hashCode}`;

    return { message: 'email sent', ...returnOnDev({ link, code }) };
  }

  @Get('token')
  async getToken(@TokenDecorator() { id }: TokenDataDto) {
    const account = await this.accountService.findOneOrErrorOut({
      _id: id,
    });

    const tokenData: TokenDataDto = {
      id: account._id.toString(),
      role: account.role,
      email: account.email,
    };

    const accessToken = await this.tokenService.signToken(tokenData);

    return { accessToken, account };
  }
}
