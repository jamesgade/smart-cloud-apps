import { Controller, UseGuards, Get, Query, Param } from '@nestjs/common';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Crud, CrudController } from '@dataui/crud';
import { Loan } from '@smart-cloud-apps/common-api-lib';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@Controller('loans')
@UseGuards(JwtAuthGuard)
@Crud({
  model: {
    type: Loan,
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
  params: {
    id: {
      field: 'loanId',
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
        field: 'bankName',
        order: 'ASC',
      },
    ],
  },
})
@ApiTags('Loans')
@ApiBearerAuth('access-token')
export class LoanController implements CrudController<Loan> {
  constructor(public service: LoanService) {}

  @Get('by-bank/:bankName')
  @ApiOperation({ description: 'Get loans by bank name' })
  @ApiParam({ name: 'bankName', description: 'Bank name to search for' })
  async getLoansByBank(@Param('bankName') bankName: string) {
    return this.service.getLoansByBank(bankName);
  }

  @Get('by-interest-rate')
  @ApiOperation({ description: 'Get loans by interest rate range' })
  @ApiQuery({ name: 'minRate', description: 'Minimum interest rate', required: false })
  @ApiQuery({ name: 'maxRate', description: 'Maximum interest rate', required: false })
  async getLoansByInterestRate(
    @Query('minRate') minRate?: number,
    @Query('maxRate') maxRate?: number
  ) {
    if (minRate && maxRate) {
      return this.service.getLoansByInterestRateRange(minRate, maxRate);
    }
    return this.service.getTopRatedLoans();
  }

  @Get('by-amount-range')
  @ApiOperation({ description: 'Get loans by amount range' })
  @ApiQuery({ name: 'minAmount', description: 'Minimum loan amount', required: false })
  @ApiQuery({ name: 'maxAmount', description: 'Maximum loan amount', required: false })
  async getLoansByAmountRange(
    @Query('minAmount') minAmount?: number,
    @Query('maxAmount') maxAmount?: number
  ) {
    if (minAmount && maxAmount) {
      return this.service.getLoansByAmountRange(minAmount, maxAmount);
    }
    return this.service.getTopRatedLoans();
  }

  @Get('no-collateral')
  @ApiOperation({ description: 'Get loans that do not require collateral' })
  async getLoansWithoutCollateral() {
    return this.service.getLoansWithoutCollateral();
  }

  @Get('no-guarantor')
  @ApiOperation({ description: 'Get loans that do not require guarantor' })
  async getLoansWithoutGuarantor() {
    return this.service.getLoansWithoutGuarantor();
  }

  @Get('search')
  @ApiOperation({ description: 'Search loans by bank name' })
  @ApiQuery({ name: 'q', description: 'Search term', required: true })
  async searchLoans(@Query('q') searchTerm: string) {
    return this.service.searchLoansByBank(searchTerm);
  }

  @Get('top-rated')
  @ApiOperation({ description: 'Get top-rated loans (lowest interest rates)' })
  @ApiQuery({ name: 'limit', description: 'Number of results to return', required: false })
  async getTopRatedLoans(@Query('limit') limit?: number) {
    return this.service.getTopRatedLoans(limit);
  }
}
