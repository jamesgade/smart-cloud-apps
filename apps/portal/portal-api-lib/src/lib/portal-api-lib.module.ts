import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Keyv from 'keyv';
import { CacheableMemory } from 'cacheable';
import KeyvRedis, { createCluster } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import config from './config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpErrorFilter} from '@smart-cloud-apps/common-api-lib'
import { typeormConnectionString } from './config/db/db.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { LoggerModule } from 'nestjs-pino';
import {AuthModule} from './modules/auth/auth.module'
import { ProviderModule } from './modules/auth/provider/provider.module';
import { ChatModule } from './modules/chat/chat.module';
import { CourseModule } from './modules/courses/course.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { LoanModule } from './modules/loans/loan.module';
import { ScholarshipModule } from './modules/scholarships/scholarship.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { ApplicationModule } from './modules/applications/application.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ExamsModule } from './modules/exams/exams.module';
import { BlogModule } from './modules/blogs/blog.module';
import { CommonModule } from './modules/common/common.module';

const envModule = ConfigModule.forRoot({
  isGlobal: true,
});

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_FILTER, // Global error filter for handling HTTP exceptions
      useClass: HttpErrorFilter,
    },
    // {
    //   provide: APP_PIPE, // Global validation pipe using Zod for schema validation
    //   useClass: ZodValidationPipe,
    // },
    ConfigService
  ],
  imports: [
        // Logger module configuration with Pino for structured logging
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'error' : 'debug', // Log level based on environment
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty', // Pretty-print logs in non-production environments
                options: {
                  levelFirst: true,
                  translateTime: 'SYS:standard', // Format timestamps
                  singleLine: true,
                },
              }
            : undefined,
        autoLogging: true, // Automatically log incoming requests
        serializers: {
          req: (req) => ({
            method: req.method, // Log HTTP method
            url: req.url, // Log request URL
          }),
          res: (res) => ({
            statusCode: res.statusCode, // Log response status code
          }),
        },
      },
    }),
    envModule,
    AuthModule,
    ProviderModule,
    ChatModule,
    CourseModule,
    AppointmentsModule,
    ReportsModule,
    ExamsModule,
    SessionsModule,
        LoanModule,
        ScholarshipModule,
        MessagingModule,
        ApplicationModule,
        BlogModule,
        CommonModule,
        TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await typeormConnectionString, {
          autoLoadEntities: true,
        }),
    }),
        CacheModule.registerAsync(
      config.ENABLE_CACHING
        ? {
            useFactory: async () => {
              return {
                isGlobal: true,
                ttl: config.REDIS_TTL,
                stores: [
                  // If you need in-memory cache, uncomment the code below.
                  // new Keyv({
                  //   store: new CacheableMemory({
                  //     ttl: config.REDIS_TTL,
                  //     lruSize: 5000,
                  //   }),
                  // }),
                  new KeyvRedis(
                    createCluster({
                      rootNodes: [
                        {
                          url: `redis://${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`,
                        },
                      ],
                    })
                  ),
                ],
              };
            },
          }
        : {
            useFactory: async () => ({
              isGlobal: true,
              ttl: config.REDIS_TTL,
            }),
          }
    ),
  ],
  exports: [],
})
export class PortalApiLibModule {}
