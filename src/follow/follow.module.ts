import { Module } from '@nestjs/common';
import { FollowService } from './service/follow.service';
import { FollowController } from './controller/follow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './model/follow.model';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Follow.name, useFactory: () => FollowSchema },
    ]),
  ],
})
export class FollowModule {}
