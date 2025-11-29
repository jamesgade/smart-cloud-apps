import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from '@smart-cloud-apps/common-api-lib';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Loan])],
  controllers: [LoanController],
  providers: [LoanService],
  exports: [LoanService],
})
export class LoanModule {}
