import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { EXCLUDE_TRANSFORM_INTERCEPTOR } from 'src/auth/decorators/ExcludeTransformInterceptor';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isExcluded = this.reflector.get<boolean>(EXCLUDE_TRANSFORM_INTERCEPTOR, context.getHandler());
    if (isExcluded) {
      return next.handle();
    }
    return next.handle().pipe(map(data => classToPlain(data)));
  }
}
