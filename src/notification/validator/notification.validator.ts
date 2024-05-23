import { paginationValidator } from './../../../libs/utils/src/pagination/validator/paginate.validator';
import * as Joi from 'joi';
import {
  NotificationTypeEnum,
  SearchNotificationDto,
} from '../dto/notification.dto';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';

export const searchNotificationValidator =
  paginationValidator.append<SearchNotificationDto>({
    notificationType: Joi.string().valid(
      ...Object.values(NotificationTypeEnum),
    ),
    read: Joi.boolean(),
    id: objectIdValidator,
  });
