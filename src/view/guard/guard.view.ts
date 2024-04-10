import { Reflector } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { Request } from 'express';
import { ViewEventEnum } from '../enum/view.enum';
import { View } from '../model/view.model';
import { ResourceEnum } from '../../../libs/utils/src/enum/resource.enum';
import { Types } from 'mongoose';

@Injectable()
export class ViewEventGuard implements CanActivate {
  constructor(
    private readonly EventEmitter: EventEmitter2,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const resource = this.reflector.get(
        'resource',
        context.getHandler(),
      ) as ResourceEnum;

      const request: Request = context.switchToHttp().getRequest();
      const query = request.query as unknown as { id: string };

      if ('id' in query) {
        const view: View = {
          ip: request.ip,
          account: new Types.ObjectId().toString(),
          item: query.id,
          reference: resource,
          timestamp: new Date(),
        };
        this.EventEmitter.emit(ViewEventEnum.CREATE_VIEW_EVENT, view);
      }

      return true;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
