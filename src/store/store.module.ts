import { Module } from '@nestjs/common';
import { StoreService } from './service/store.service';
import { StoreController } from './controller/store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './model/store.model';
import { AccountModule } from '../account/account.module';

@Module({
  controllers: [StoreController],
  providers: [StoreService],
  imports: [
    AccountModule,
    MongooseModule.forFeatureAsync([
      { name: Store.name, useFactory: () => StoreSchema },
    ]),
  ],
})
export class StoreModule {}
