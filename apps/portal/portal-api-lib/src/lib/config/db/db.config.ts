import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import config from '../../config';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'; 

const sslConfig: PostgresConnectionOptions['ssl'] | false =
  config.NODE_ENV === 'production' && config.DATABASE_SSL_CERT
    ? {
        rejectUnauthorized: true, // Enforce certificate validation in production
        ca: config.DATABASE_SSL_CERT, // Certificate content as a string
      }
    : false; // Disable SSL for non-production environments or if no cert is provided

export const typeormConnectionString: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  username: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  entities: ['apps/portal/portal-api/**/**/**/**/*.entity.{js,ts}'],
  synchronize: false,
  maxQueryExecutionTime: 10000,
  logging: ['error'],
  extra: {
    poolSize: 50,
    statement_timeout: 30000,
    query_timeout: 30000,
  },
  ...(sslConfig ? { ssl: sslConfig } : {}),
};
