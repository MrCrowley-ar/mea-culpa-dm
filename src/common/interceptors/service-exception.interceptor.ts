import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import {
  ServiceException,
  NotFoundServiceException,
  ConflictServiceException,
  ForbiddenServiceException,
  ValidationServiceException,
} from '../exceptions/service.exception';

@Injectable()
export class ServiceExceptionInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof NotFoundServiceException) {
          throw new NotFoundException(error.message);
        }
        if (error instanceof ConflictServiceException) {
          throw new ConflictException(error.message);
        }
        if (error instanceof ForbiddenServiceException) {
          throw new ForbiddenException(error.message);
        }
        if (error instanceof ValidationServiceException) {
          throw new BadRequestException(error.message);
        }
        if (error instanceof ServiceException) {
          throw new BadRequestException(error.message);
        }
        throw error;
      }),
    );
  }
}
