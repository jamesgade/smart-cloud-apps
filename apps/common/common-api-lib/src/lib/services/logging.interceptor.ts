import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
// LoggingInterceptor is a NestJS interceptor that logs HTTP request details and their execution time.
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    // Set the logging context to the name of the interceptor class.
    this.logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Capture the current timestamp to calculate the request duration later.
    const now = Date.now();

    // Extract the HTTP request object from the execution context.
    const req = context.switchToHttp().getRequest();
    const method = req.method; // HTTP method (e.g., GET, POST).
    const url = req.url; // URL of the request.

    // Pass the request to the next handler and log the details after it completes.
    return next.handle().pipe(
      tap(() => {
        // Calculate the duration of the request.
        const duration = Date.now() - now;

        // Log the HTTP method, URL, duration, and the class name of the context.
        this.logger.info(
          { method, url, duration },
          `${method} ${url} ${duration}ms`,
          context.getClass().name
        );
      })
    );
  }
}
