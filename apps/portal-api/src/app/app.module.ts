import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PortalApiLibModule } from '@smart-cloud-apps/portal-api-lib';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PortalApiLibModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
