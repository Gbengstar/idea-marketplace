import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
