import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { S3Service } from './services/s3.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [],
  providers: [S3Service],
  exports: [S3Service],
})
export class CommonApiLibModule {}
