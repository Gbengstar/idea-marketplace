import { PaginationDto } from '../../../libs/utils/src/pagination/dto/paginate.dto';
import { Notification } from '../model/notification.model';

export type SearchNotificationDto = PaginationDto &
  Notification & { id: string };

export enum NotificationTypeEnum {
  GUEST = 'GUEST',
  VENDOR = 'VENDOR',
}
