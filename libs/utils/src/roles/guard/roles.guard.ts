import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from '../enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let roles = this.reflector.get('roles', context.getClass()) as RolesEnum[];
    if (!roles) {
      roles = this.reflector.get('roles', context.getHandler()) as RolesEnum[];
    }

    if (!roles) {
      return true;
    }

    const response = context.switchToHttp().getResponse();

    const role = response.locals.role;
    if (!role) {
      return false;
    }

    return roles.includes(role);
  }
}
