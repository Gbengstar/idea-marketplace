import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseStatusEnum } from '../general/response/response.dto';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // const response = context.switchToHttp().getResponse();

        const responseBody = {
          status: ResponseStatusEnum.SUCCESS,
          message: 'Request completed successfully',
          data,
        };

        return responseBody;
      }),
    );
  }
}
