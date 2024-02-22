import { BaseService } from '@app/utils/database/service/db.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Otp } from '../models/otp.model';
import {
  hash,
  verifyHash,
} from '@app/utils/general/function/password.function';
import { EnvConfigEnum } from '@app/utils/config/env.enum';

@Injectable()
export class OtpService extends BaseService<Otp> {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectModel(Otp.name)
    private readonly otpModel: Model<Otp>,
    private readonly configService: ConfigService,
  ) {
    super(otpModel);
  }

  async hashAndSaveOtp(
    { email, code }: Pick<Otp, 'email' | 'code'>,
    session?: ClientSession,
  ) {
    const [hashCode] = await Promise.all([
      hash(code),
      this.otpModel.deleteMany({ email }, { session }),
    ]);
    const date = new Date();
    //   expire in ten minutes
    const expirationDate = new Date(date.getTime() + 10 * 60000);

    return this.createWithSession(
      [
        {
          email,
          code: hashCode,
          expirationDate,
        },
      ],
      session,
    );
  }

  async verifyHashedOtp(
    { email, code }: Pick<Otp, 'email' | 'code'>,
    canExpire = true,
  ) {
    const foundCode = await this.otpModel
      .findOne({ email })
      .sort({ createdAt: -1 });

    if (!foundCode) {
      throw new NotFoundException(`no OTP is associated with ${email}`);
    }

    if (canExpire) {
      const expiryTime = new Date(foundCode.expirationDate).getTime();
      const currentTime = new Date().getTime();

      if (currentTime > expiryTime) {
        await this.otpModel.deleteMany({ email });
        throw new BadRequestException(
          'OTP has expired, please generate a new one',
        );
      }
    }
    const isValid = await verifyHash(foundCode.code, code);
    if (!isValid) {
      await this.otpModel.deleteMany({ email });
      throw new BadRequestException('invalid OTP, please generate a new one');
    }
    await this.otpModel.deleteMany({ email });
    return isValid;
  }

  voidForProductionEnv(value: any) {
    this.logger.debug({
      environment: this.configService.getOrThrow(EnvConfigEnum.NODE_ENV),
    });
    const code =
      this.configService.getOrThrow(EnvConfigEnum.NODE_ENV) === 'production'
        ? undefined
        : value;

    return code;
  }
}
