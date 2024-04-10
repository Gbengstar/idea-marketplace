import { Module } from '@nestjs/common';
import { TalentService } from './service/talent.service';
import { TalentController } from './controller/talent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Talent, TalentSchema } from './model/talent.model';
import { ViewModule } from '../view/view.module';

@Module({
  controllers: [TalentController],
  providers: [TalentService],
  exports: [TalentService],
  imports: [
    ViewModule,
    MongooseModule.forFeatureAsync([
      { name: Talent.name, useFactory: () => TalentSchema },
    ]),
  ],
})
export class TalentModule {}
