import { HttpException, HttpStatus } from '@nestjs/common';
// Importing necessary decorators and modules from NestJS framework
export class BadRequestException extends HttpException {
  constructor() {
    super('Bad request. Please check your inputs', HttpStatus.BAD_REQUEST);
  }
}
