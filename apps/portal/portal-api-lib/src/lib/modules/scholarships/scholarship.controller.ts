import { Controller, UseGuards, Get, Query, Param } from '@nestjs/common';
import { ScholarshipService } from './scholarship.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Crud, CrudController } from '@dataui/crud';
import { Scholarship } from '@smart-cloud-apps/common-api-lib';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@Controller('scholarships')
@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Scholarship,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
  params: {
    id: {
      field: 'scholarshipId',
      type: 'string',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    limit: 10,
    maxLimit: 100,
    exclude: ['createdBy', 'updatedBy', 'updatedAt', 'createdAt'],
    sort: [
      {
        field: 'scholarshipName',
        order: 'ASC',
      },
    ],
  },
})
@ApiTags('Scholarships')
@ApiBearerAuth('access-token')
export class ScholarshipController implements CrudController<Scholarship> {
  constructor(public service: ScholarshipService) {}

  @Get('by-provider/:provider')
  @ApiOperation({ description: 'Get scholarships by provider' })
  @ApiParam({ name: 'provider', description: 'Provider name to search for' })
  async getScholarshipsByProvider(@Param('provider') provider: string) {
    return this.service.getScholarshipsByProvider(provider);
  }

  @Get('by-education-level')
  @ApiOperation({ description: 'Get scholarships by education level' })
  @ApiQuery({ name: 'level', description: 'Education level (UG, PG, PhD, etc.)', required: true })
  async getScholarshipsByEducationLevel(@Query('level') educationLevel: string) {
    return this.service.getScholarshipsByEducationLevel(educationLevel);
  }

  @Get('by-amount-range')
  @ApiOperation({ description: 'Get scholarships by amount range' })
  @ApiQuery({ name: 'minAmount', description: 'Minimum scholarship amount', required: false })
  @ApiQuery({ name: 'maxAmount', description: 'Maximum scholarship amount', required: false })
  async getScholarshipsByAmountRange(
    @Query('minAmount') minAmount?: number,
    @Query('maxAmount') maxAmount?: number
  ) {
    if (minAmount && maxAmount) {
      return this.service.getScholarshipsByAmountRange(minAmount, maxAmount);
    }
    return this.service.getHighValueScholarships();
  }

  @Get('high-value')
  @ApiOperation({ description: 'Get high-value scholarships' })
  @ApiQuery({ name: 'limit', description: 'Number of results to return', required: false })
  async getHighValueScholarships(@Query('limit') limit?: number) {
    return this.service.getHighValueScholarships(limit);
  }

  @Get('search')
  @ApiOperation({ description: 'Search scholarships by name' })
  @ApiQuery({ name: 'q', description: 'Search term', required: true })
  async searchScholarships(@Query('q') searchTerm: string) {
    return this.service.searchScholarshipsByName(searchTerm);
  }
}
