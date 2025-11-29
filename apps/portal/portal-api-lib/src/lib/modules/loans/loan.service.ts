import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uniq } from 'lodash';
import { Loan } from '@smart-cloud-apps/common-api-lib';
import { QueryOptions } from '@dataui/crud';
import { ParsedRequestParams } from '@dataui/crud-request';
import { CrudRequest } from '@dataui/crud';

@Injectable()
export class LoanService extends TypeOrmCrudService<Loan> {
  override getSelect(query: ParsedRequestParams, options: QueryOptions) {
    return uniq(super.getSelect(query, options));
  }
  
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>
  ) {
    super(loanRepository);
  }

  override async createOne(req: CrudRequest, dto: Partial<Loan>): Promise<Loan> {
    // Add audit fields for creation
    const entityToSave = {
      ...dto,
      createdBy: 'system', // You can get this from the request context or JWT
      updatedBy: 'system',
    };
    
    return super.createOne(req, entityToSave);
  }

  override async updateOne(req: CrudRequest, dto: Partial<Loan>): Promise<Loan> {
    // Add audit fields for update
    const entityToUpdate = {
      ...dto,
      updatedBy: 'system', // You can get this from the request context or JWT
    };
    
    return super.updateOne(req, entityToUpdate);
  }

  /**
   * Get loans by bank name
   */
  async getLoansByBank(bankName: string): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { bankName, isActive: true },
      order: { interestRate: 'ASC' },
    });
  }

  /**
   * Get loans by interest rate range
   */
  async getLoansByInterestRateRange(minRate: number, maxRate: number): Promise<Loan[]> {
    return this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.interestRate >= :minRate', { minRate })
      .andWhere('loan.interestRate <= :maxRate', { maxRate })
      .andWhere('loan.isActive = :isActive', { isActive: true })
      .orderBy('loan.interestRate', 'ASC')
      .getMany();
  }

  /**
   * Search loans by bank name
   */
  async searchLoansByBank(searchTerm: string): Promise<Loan[]> {
    return this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.bankName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('loan.isActive = :isActive', { isActive: true })
      .orderBy('loan.bankName', 'ASC')
      .getMany();
  }

  /**
   * Get loans with no collateral requirement
   */
  async getLoansWithoutCollateral(): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { collateralRequired: false, isActive: true },
      order: { interestRate: 'ASC' },
    });
  }

  /**
   * Get loans with no guarantor requirement
   */
  async getLoansWithoutGuarantor(): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { guarantorRequired: false, isActive: true },
      order: { interestRate: 'ASC' },
    });
  }

  /**
   * Get top-rated loans (lowest interest rates)
   */
  async getTopRatedLoans(limit: number = 10): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { isActive: true },
      order: { interestRate: 'ASC' },
      take: limit,
    });
  }

  /**
   * Get loans by amount range
   */
  async getLoansByAmountRange(minAmount: number, maxAmount: number): Promise<Loan[]> {
    return this.loanRepository
      .createQueryBuilder('loan')
      .where('loan.loanAmountMin <= :maxAmount', { maxAmount })
      .andWhere('loan.loanAmountMax >= :minAmount', { minAmount })
      .andWhere('loan.isActive = :isActive', { isActive: true })
      .orderBy('loan.interestRate', 'ASC')
      .getMany();
  }
}
