import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Loan } from '@smart-cloud-apps/common-api-lib';

@Injectable()
export class ReportsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
    private readonly entityManager: EntityManager
  ) {
    this.logger.setContext(ReportsService.name);
  }

  async getLoanReports() {
    const loanReports = await this.entityManager.query(`
      SELECT count(distinct loan_id) as total_loans FROM common.loans
      WHERE is_active = 'true'
    `);
    return loanReports[0].total_loans;
  }
  async getScholarshipReports() {
    const scholarshipReports = await this.entityManager.query(`
      SELECT count(distinct scholarship_id) as total_scholarships FROM common.scholarships
      WHERE is_active = 'true'
    `);
    return scholarshipReports[0].total_scholarships;
  }
  async getCollegeReports() {
    const collegeReports = await this.entityManager.query(`
      SELECT count(distinct college_id) as total_colleges FROM common.colleges
      WHERE is_active = 'true'
    `);
    return collegeReports[0].total_colleges;
  }
  async getCourseReports() {
    const courseReports = await this.entityManager.query(`
      SELECT count(distinct course_id) as total_courses FROM student.course
      WHERE status = 'true'
    `);
    return courseReports[0].total_courses;
  }

  async getCounsellsReports(studentId: string) {
    const counsellsReports = await this.entityManager.query(`
      SELECT count(distinct appointment_id) as total_counsells FROM counselling.appointments
      WHERE student_id = $1
    `,[studentId]);
    return counsellsReports[0].total_counsells;
  }

  async getStudentSummary(userId?: string) {
    // Total active students
    const totalRows = await this.entityManager.query(`
      SELECT COUNT(*)::INT AS total
      FROM student.student s
      WHERE COALESCE(s.status, 'ACTIVE') = 'ACTIVE'
    `);

    // Students added today (UTC based on server time)
    const todayRows = await this.entityManager.query(`
      SELECT COUNT(*)::INT AS today
      FROM student.student s
      WHERE COALESCE(s.status, 'ACTIVE') = 'ACTIVE'
        AND s.created_at >= CURRENT_DATE
        AND s.created_at < (CURRENT_DATE + INTERVAL '1 day')
    `);

    // Assigned students (active assignment)
    let assignedRows;
    if (userId) {
      assignedRows = await this.entityManager.query(`
        SELECT COUNT(DISTINCT a.student_id)::INT AS assigned
        FROM common.assigned_students a
        INNER JOIN student.student s ON s.student_id = a.student_id
        WHERE COALESCE(s.status, 'ACTIVE') = 'ACTIVE'
          AND a.assignment_status = 'ACTIVE'
          AND a.assigned_to = $1
      `, [userId]);
    } else {
      assignedRows = await this.entityManager.query(`
        SELECT COUNT(DISTINCT a.student_id)::INT AS assigned
        FROM common.assigned_students a
        INNER JOIN student.student s ON s.student_id = a.student_id
        WHERE COALESCE(s.status, 'ACTIVE') = 'ACTIVE'
          AND a.assignment_status = 'ACTIVE'
      `);
    }

    const total = totalRows?.[0]?.total ?? 0;
    const today = todayRows?.[0]?.today ?? 0;
    const assigned = assignedRows?.[0]?.assigned ?? 0;
    const unassigned = Math.max(0, total - assigned);

    return { total, today, assigned, unassigned };
  }

  async getApplicationsSummary(userId?: string) {
    if (userId) {
      const loanRows = await this.entityManager.query(
        `
        SELECT COUNT(*)::INT AS total
        FROM applications.applications a
        INNER JOIN common.assigned_students asg ON asg.student_id = a.student_id
        WHERE a.application_type = 'LOAN'
          AND asg.assignment_status = 'ACTIVE'
          AND asg.assigned_to = $1
        `,
        [userId]
      );
      const scholarshipRows = await this.entityManager.query(
        `
        SELECT COUNT(*)::INT AS total
        FROM applications.applications a
        INNER JOIN common.assigned_students asg ON asg.student_id = a.student_id
        WHERE a.application_type = 'SCHOLARSHIP'
          AND asg.assignment_status = 'ACTIVE'
          AND asg.assigned_to = $1
        `,
        [userId]
      );
      const collegeRows = await this.entityManager.query(
        `
        SELECT COUNT(*)::INT AS total
        FROM applications.applications a
        INNER JOIN common.assigned_students asg ON asg.student_id = a.student_id
        WHERE a.application_type = 'COLLEGE'
          AND asg.assignment_status = 'ACTIVE'
          AND asg.assigned_to = $1
        `,
        [userId]
      );
      return {
        loansApplied: loanRows?.[0]?.total ?? 0,
        scholarshipsApplied: scholarshipRows?.[0]?.total ?? 0,
        collegesApplied: collegeRows?.[0]?.total ?? 0,
      };
    }

    const loanRows = await this.entityManager.query(`
      SELECT COUNT(*)::INT AS total
      FROM applications.applications a
      WHERE a.application_type = 'LOAN'
    `);
    const scholarshipRows = await this.entityManager.query(`
      SELECT COUNT(*)::INT AS total
      FROM applications.applications a
      WHERE a.application_type = 'SCHOLARSHIP'
    `);
    const collegeRows = await this.entityManager.query(`
      SELECT COUNT(*)::INT AS total
      FROM applications.applications a
      WHERE a.application_type = 'COLLEGE'
    `);
    return {
      loansApplied: loanRows?.[0]?.total ?? 0,
      scholarshipsApplied: scholarshipRows?.[0]?.total ?? 0,
      collegesApplied: collegeRows?.[0]?.total ?? 0,
    };
  }

  async getPendingFollowups() {
    const rows = await this.entityManager.query(`
      SELECT COUNT(*)::INT AS pending
      FROM student.student_followup f
      WHERE f.status = 'SCHEDULED'
        AND (f.next_followup_date IS NULL OR f.next_followup_date >= CURRENT_DATE)
    `);
    return rows?.[0]?.pending ?? 0;
  }
}
