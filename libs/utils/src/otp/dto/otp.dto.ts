import { Otp } from '../models/otp.model';

export class OtpDto {
  code: number;
}

export type VerifyOtpByEmailDto = Pick<Otp, 'email' | 'code'>;
