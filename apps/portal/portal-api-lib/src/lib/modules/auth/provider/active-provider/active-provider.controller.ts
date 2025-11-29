// import { ActiveUserDto } from '@miyo-cloud-apps/provider/provider-common';
import { Body, Controller, Get, Patch, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveProviderService } from './active-provider.service';
import { ActiveUserDto } from '@smart-cloud-apps/portal-common';

@Controller('active-provider')
@ApiTags('Provider')
export class ActiveProviderController {
  constructor(private readonly service: ActiveProviderService) {}

  @Get()
  async getActiveProvider(@Query('token') token: string, @Req() req: any) {
    return await this.service.getActiveProviderUser(token, req);
  }

  @Patch()
  async activeProvider(
    @Query('token') token: string,
    @Body() dto: ActiveUserDto,
    @Req() req: any
  ) {
    return await this.service.activeProviderUser(token, dto, req);
  }
}
