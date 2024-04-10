import { Module } from '@nestjs/common';
import { ViewService } from './service/view.service';
import { ViewController } from './controller/view.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { View, ViewSchema } from './model/view.model';
import { ViewEventGuard } from './guard/guard.view';

@Module({
  controllers: [ViewController],
  providers: [ViewService, ViewEventGuard],
  exports: [ViewService, ViewEventGuard],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: View.name, useFactory: () => ViewSchema },
    ]),
  ],
})
export class ViewModule {}
