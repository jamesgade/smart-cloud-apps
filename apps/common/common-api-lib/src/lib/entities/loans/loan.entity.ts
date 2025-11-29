import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Index('loans_pkey', ['loanId'], { unique: true })
@Entity({ schema: 'common', name: 'loans' })
export class Loan extends BaseEntity {
  @Column('uuid', {
    primary: true,
    name: 'loan_id',
    default: () => 'uuid_generate_v4()',
  })
  loanId: string;

  @Column({ type: 'varchar', length: 255, name: 'bank_name' })
  bankName: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'loan_amount_min' })
  loanAmountMin: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'loan_amount_max' })
  loanAmountMax: number;

  @Column({ type: 'text', nullable: true, name: 'coverage_details' })
  coverageDetails: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'interest_rate' })
  interestRate: number;

  @Column({ type: 'varchar', length: 20, default: 'FIXED', name: 'interest_type' })
  interestType: string;

  @Column({ type: 'integer', nullable: true, name: 'moratorium_period_months' })
  moratoriumPeriodMonths: number;

  @Column({ type: 'integer', nullable: true, name: 'repayment_duration_months' })
  repaymentDurationMonths: number;

  @Column({ type: 'text', nullable: true, name: 'eligibility_criteria' })
  eligibilityCriteria: string;

  @Column({ type: 'boolean', default: false, name: 'collateral_required' })
  collateralRequired: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'collateral_threshold_amount' })
  collateralThresholdAmount: number;

  @Column({ type: 'boolean', default: false, name: 'guarantor_required' })
  guarantorRequired: boolean;

  @Column({ type: 'text', nullable: true, name: 'overall_remarks' })
  overallRemarks: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
