import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './models/otp.model';
import { OtpService } from './services/otp.service';

@Module({
  providers: [OtpService],
  exports: [OtpService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Otp.name, useFactory: () => OtpSchema },
    ]),
  ],
})
export class OtpModule {}
