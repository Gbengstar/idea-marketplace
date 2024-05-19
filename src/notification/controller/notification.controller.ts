import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { NotificationService } from '../service/notification.service';
import { TokenDataDto } from '../../../libs/utils/src/token/dto/token.dto';
import { TokenDecorator } from '../../../libs/utils/src/token/decorator/token.decorator';
import {
  ArrayValidationPipe,
  BooleanValidationPipe,
  ObjectValidationPipe,
  StringValidationPipe,
} from '../../../libs/utils/src/pipe/validation.pipe';
import { SearchNotificationDto } from '../dto/notification.dto';
import { FilterQuery } from 'mongoose';
import { Notification } from '../model/notification.model';
import { searchNotificationValidator } from '../validator/notification.validator';
import { objectIdValidator } from '../../../libs/utils/src/validator/objectId.validator';
import { arrayValidator } from '../../../libs/utils/src/validator/custom.validator';

@Controller('notification')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotification(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Query(new ObjectValidationPipe(searchNotificationValidator))
    { limit, page, ...query }: SearchNotificationDto,
  ) {
    const filter: FilterQuery<Notification> = { account };
    if ('notificationType' in query) {
      filter.notificationType = query.notificationType;
    }

    if ('read' in query) {
      filter.read = query.read;
    }

    if ('id' in query) {
      filter._id = query.id;
    }

    return this.notificationService.paginatedResult(
      { limit, page },
      filter,
      { createdAt: -1 },
      [{ path: 'item' }],
    );
  }

  @Patch('/:id')
  markNotification(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Param('id', new StringValidationPipe(objectIdValidator.required()))
    id: string,
    @Body('read', new BooleanValidationPipe()) read: boolean,
  ) {
    return this.notificationService.findOneAndUpdateOrErrorOut(
      { _id: id, account },
      { read },
    );
  }

  @Delete()
  deleteNotification(
    @TokenDecorator() { id: account }: TokenDataDto,
    @Query('id', new ArrayValidationPipe(arrayValidator.required()))
    id: string[],
  ) {
    this.logger.log({ id });
    return this.notificationService.model.deleteMany({
      _id: { $in: id },
      account,
    });
  }
}
