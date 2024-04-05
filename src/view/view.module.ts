import { Module } from '@nestjs/common';
import { ViewService } from './view.service';
import { ViewController } from './view.controller';

@Module({
  controllers: [ViewController],
  providers: [ViewService]
})
export class ViewModule {}
