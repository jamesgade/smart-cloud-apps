import { Controller, UseGuards, Get, Query, Param, Request } from '@nestjs/common';
import { CollegeService } from './college.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Crud, CrudController, ParsedRequest, CrudRequest, Override } from '@dataui/crud';
import { College } from '@smart-cloud-apps/common-api-lib';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@Controller('colleges')
@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: College,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
  params: {
    id: {
      field: 'collegeId',
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
        field: 'name',
        order: 'ASC',
      },
    ],
    // Note: Filtering for active colleges is handled in the frontend
    // to allow admins to update inactive colleges
  },
})
@ApiTags('Colleges')
@ApiBearerAuth('access-token')
export class CollegeController implements CrudController<College> {
  constructor(public service: CollegeService) {}

  @Override('getManyBase')
  async getMany(@ParsedRequest() req: CrudRequest, @Request() httpReq: any) {
    const queryParams = httpReq.query || {};
    
    // Check for search term - Refine sends it as 'name' query parameter
    const searchTerm = queryParams.name || 
                      queryParams['filter[name][$cont]'] || 
                      queryParams['filter[name][contains]'] ||
                      queryParams['filter[name][$contL]'] ||
                      queryParams.search ||
                      queryParams.q;
    
    // Also check parsed filters
    const parsedFilters = req.parsed?.filter || [];
    let nameFilterValue = null;
    if (parsedFilters.length > 0) {
      const nameFilter = parsedFilters.find((f: any) => 
        f.field === 'name' && (f.operator === '$cont' || f.operator === 'contains' || f.operator === '$contL' || f.operator === '$ilike')
      );
      if (nameFilter) {
        nameFilterValue = nameFilter.value;
      }
    }
    
    const finalSearchTerm = searchTerm || nameFilterValue;

    if (finalSearchTerm) {
      // Use the search method if search term exists (include inactive for admins)
      const results = await this.service.searchCollegesByName(finalSearchTerm, true);
      
      // Apply pagination manually
      const page = req.parsed.page || 1;
      const limit = req.parsed.limit || 10;
      const offset = (page - 1) * limit;
      const paginatedResults = results.slice(offset, offset + limit);
      
      return {
        data: paginatedResults,
        count: results.length,
        total: results.length,
        page: page,
        pageCount: Math.ceil(results.length / limit),
      };
    }

    // Otherwise use the default CRUD method
    return this.service.getMany(req);
  }
}