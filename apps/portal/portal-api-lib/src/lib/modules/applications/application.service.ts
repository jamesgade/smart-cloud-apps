import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Application } from '@smart-cloud-apps/common-api-lib';

export interface CreateApplicationDto {
  studentId: string;
  studentName: string;
  applicationType: 'LOAN' | 'SCHOLARSHIP' | 'COLLEGE';
  applicationTitle: string;
  applicationDetails?: string;
}

export interface UpdateApplicationDto {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  reviewedBy?: string;
  reviewedDate?: Date;
  reviewNotes?: string;
}

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  async createApplication(createDto: CreateApplicationDto, userId: string): Promise<Application> {
    const application = this.applicationRepository.create({
      ...createDto,
      createdBy: userId,
      updatedBy: userId,
    });

    return await this.applicationRepository.save(application);
  }

  async findAll(): Promise<Application[]> {
    return await this.applicationRepository.find({
      order: { appliedDate: 'DESC' },
    });
  }

  async findByStudentId(studentId: string): Promise<Application[]> {
    return await this.applicationRepository.find({
      where: { studentId },
      order: { appliedDate: 'DESC' },
    });
  }

  async findById(applicationId: string): Promise<Application | null> {
    return await this.applicationRepository.findOne({
      where: { applicationId },
    });
  }

  async updateApplication(
    applicationId: string, 
    updateDto: UpdateApplicationDto, 
    userId: string
  ): Promise<Application | null> {
    const application = await this.findById(applicationId);
    if (!application) {
      return null;
    }

    const updateData = {
      ...updateDto,
      updatedBy: userId,
    };

    // If status is being updated, set reviewed date
    if (updateDto.status && updateDto.status !== 'PENDING') {
      updateData.reviewedDate = new Date();
    }

    await this.applicationRepository.update(applicationId, updateData);
    return await this.findById(applicationId);
  }

  async deleteApplication(applicationId: string): Promise<boolean> {
    const result = await this.applicationRepository.delete(applicationId);
    return result.affected > 0;
  }

  async getPendingApplications(): Promise<Application[]> {
    return await this.applicationRepository.find({
      where: { status: 'PENDING' },
      order: { appliedDate: 'ASC' },
    });
  }

  async getPendingApplicationsByAssignedStudents(assignedToUserId: string): Promise<Application[]> {
    try {
      // Check if assigned_students table exists
      const tableExists = await this.entityManager.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'common' 
          AND table_name = 'assigned_students'
        );
      `);

      const hasAssignmentTable = tableExists[0]?.exists || false;

      if (!hasAssignmentTable) {
        return [];
      }

      // Query to get pending applications for assigned students
      const query = `
        SELECT DISTINCT
          a.application_id as "applicationId",
          a.student_id as "studentId",
          a.student_name as "studentName",
          a.application_type as "applicationType",
          a.application_title as "applicationTitle",
          a.application_details as "applicationDetails",
          a.status,
          a.applied_date as "appliedDate",
          a.reviewed_by as "reviewedBy",
          a.reviewed_date as "reviewedDate",
          a.review_notes as "reviewNotes",
          a.created_at as "createdAt",
          a.updated_at as "updatedAt",
          a.created_by as "createdBy",
          a.updated_by as "updatedBy"
        FROM applications.applications a
        INNER JOIN common.assigned_students ast ON a.student_id = ast.student_id
        WHERE ast.assignment_status = 'ACTIVE'
          AND ast.assigned_to = $1::uuid
          AND a.status = 'PENDING'
        ORDER BY a.applied_date ASC
      `;

      const results = await this.entityManager.query(query, [assignedToUserId]);
      return results;
    } catch (error) {
      return [];
    }
  }

  async getApplicationsByType(applicationType: 'LOAN' | 'SCHOLARSHIP' | 'COLLEGE'): Promise<Application[]> {
    return await this.applicationRepository.find({
      where: { applicationType },
      order: { appliedDate: 'DESC' },
    });
  }

  async findByAssignedStudents(assignedToUserId: string): Promise<Application[]> {
    try {
      // Check if assigned_students table exists
      const tableExists = await this.entityManager.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'common' 
          AND table_name = 'assigned_students'
        );
      `);

      const hasAssignmentTable = tableExists[0]?.exists || false;

      if (!hasAssignmentTable) {
        // If table doesn't exist, return empty array
        return [];
      }

      // Query to get applications for assigned students
      // Using LEFT JOIN to ensure we get all applications even if assignment doesn't exist
      // But filtering by assigned_to to only get assigned students
      const query = `
        SELECT DISTINCT
          a.application_id as "applicationId",
          a.student_id as "studentId",
          a.student_name as "studentName",
          a.application_type as "applicationType",
          a.application_title as "applicationTitle",
          a.application_details as "applicationDetails",
          a.status,
          a.applied_date as "appliedDate",
          a.reviewed_by as "reviewedBy",
          a.reviewed_date as "reviewedDate",
          a.review_notes as "reviewNotes",
          a.created_at as "createdAt",
          a.updated_at as "updatedAt",
          a.created_by as "createdBy",
          a.updated_by as "updatedBy"
        FROM applications.applications a
        INNER JOIN common.assigned_students ast ON a.student_id = ast.student_id
        WHERE ast.assignment_status = 'ACTIVE'
          AND ast.assigned_to = $1::uuid
        ORDER BY a.applied_date DESC
      `;

      const results = await this.entityManager.query(query, [assignedToUserId]);
      return results;
    } catch (error) {
      // Log error for debugging
      console.error('Error in findByAssignedStudents:', error);
      // If error occurs, return empty array
      return [];
    }
  }
}
