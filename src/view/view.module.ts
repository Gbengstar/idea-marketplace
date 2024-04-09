import { Module } from '@nestjs/common';
import { ViewService } from './service/view.service';
import { ViewController } from './controller/view.controller';

@Module({
  controllers: [ViewController],
  providers: [ViewService],
})
export class ViewModule {}
