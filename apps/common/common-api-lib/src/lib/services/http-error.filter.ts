import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundException } from './http-Not-Found-error.filter';
import { BadRequestException } from './http-bad-request-error.filter';

@Catch() // Decorator to catch all exceptions
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    // Set the logger context to the name of this filter
    this.logger.setContext(HttpErrorFilter.name);
  }

  catch(exception: Error, host: ArgumentsHost) {
    // Extract HTTP context from the ArgumentsHost
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Default status and message for unhandled exceptions
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    // Handle specific exception types
    if (exception instanceof HttpException) {
      // Handle standard HttpException
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else if (exception instanceof BadRequestException) {
      // Handle custom BadRequestException
      status = HttpStatus.BAD_REQUEST;
      message = 'Bad request. Please check your inputs';
    } else if (exception instanceof NotFoundException) {
      // Handle custom NotFoundException
      status = HttpStatus.NOT_FOUND;
      message = 'Request Not Found';
    } else if (exception instanceof Error) {
      // Handle generic Error
      message = exception.message;
    }

    // Log the error details
    this.logger.error(
      { error: exception.message, stack: exception.stack },
      message
    );

    // Send the error response to the client
    response.status(status).json({
      message,
      statusCode: status,
    });
  }
}
