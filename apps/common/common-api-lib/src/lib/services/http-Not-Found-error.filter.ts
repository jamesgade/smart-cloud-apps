import { HttpException, HttpStatus } from '@nestjs/common';

// Custom exception class for handling "Not Found" errors
export class NotFoundException extends HttpException {
  constructor() {
    // Call the parent HttpException constructor with a custom message and HTTP status code
    super('Request Not Found', HttpStatus.NOT_FOUND);
  }
}
