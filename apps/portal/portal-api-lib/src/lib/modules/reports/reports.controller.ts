import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('loan')
  async getLoanReports(): Promise<number> {
    return await this.reportsService.getLoanReports();
  }

  @Get('scholarship')
  async getScholarshipReports(): Promise<number> {
    return await this.reportsService.getScholarshipReports();
  }

  @Get('college')
  async getCollegeReports(): Promise<number> {
    return await this.reportsService.getCollegeReports();
  }

  @Get('course')
  async getCourseReports(): Promise<number> {
    return await this.reportsService.getCourseReports();
  }

  @Get('counsells/:id')
  async getCounsellsReports(@Param('id') id: string): Promise<number> {
    return await this.reportsService.getCounsellsReports(id);
  }

  @Get('students/summary')
  async getStudentSummary(): Promise<{ total: number; today: number; assigned: number; unassigned: number }> {
    return await this.reportsService.getStudentSummary();
  }

  @Get('students/summary/:userId')
  async getStudentSummaryByUser(@Param('userId') userId: string): Promise<{ total: number; today: number; assigned: number; unassigned: number }> {
    return await this.reportsService.getStudentSummary(userId);
  }

  @Get('applications/summary')
  async getApplicationsSummary(): Promise<{ loansApplied: number; scholarshipsApplied: number; collegesApplied: number }> {
    return await this.reportsService.getApplicationsSummary();
  }

  @Get('followups/pending')
  async getPendingFollowups(): Promise<number> {
    return await this.reportsService.getPendingFollowups();
  }

  @Get('applications/summary/:userId')
  async getApplicationsSummaryByUser(@Param('userId') userId: string): Promise<{ loansApplied: number; scholarshipsApplied: number; collegesApplied: number }> {
    return await this.reportsService.getApplicationsSummary(userId);
  }
}


