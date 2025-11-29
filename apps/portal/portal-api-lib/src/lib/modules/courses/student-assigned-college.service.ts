import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uniq } from 'lodash';
import { StudentAssignedCollege, Application, Student, College } from '@smart-cloud-apps/common-api-lib';
import { QueryOptions } from '@dataui/crud';
import { ParsedRequestParams } from '@dataui/crud-request';

export interface AssignCollegeDto {
  studentId: string;
  collegeId: string;
  assignmentType?: 'INTERESTED' | 'APPLIED' | 'ADMITTED' | 'ENROLLED' | 'REJECTED' | 'WAITLISTED';
  priorityOrder?: number;
  courseName?: string;
  specialization?: string;
  assignedBy?: string;
}

export interface UpdateAssignmentDto {
  assignmentType?: 'INTERESTED' | 'APPLIED' | 'ADMITTED' | 'ENROLLED' | 'REJECTED' | 'WAITLISTED';
  assignmentStatus?: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';
  priorityOrder?: number;
  applicationDate?: Date;
  admissionDate?: Date;
  enrollmentDate?: Date;
  courseName?: string;
  specialization?: string;
  semester?: string;
  studentNotes?: string;
  counsellorNotes?: string;
}

@Injectable()
export class StudentAssignedCollegeService extends TypeOrmCrudService<StudentAssignedCollege> {
  private readonly logger = new Logger(StudentAssignedCollegeService.name);

  override getSelect(query: ParsedRequestParams, options: QueryOptions) {
    return uniq(super.getSelect(query, options));
  }
  
  constructor(
    @InjectRepository(StudentAssignedCollege)
    private readonly assignmentRepository: Repository<StudentAssignedCollege>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>
  ) {
    super(assignmentRepository);
  }

  /**
   * Create or update application record for college assignment
   */
  private async createOrUpdateApplication(
    assignment: StudentAssignedCollege,
    userId: string
  ): Promise<Application | null> {
    // Fetch student and college details
    const student = await this.studentRepository.findOne({
      where: { studentId: assignment.studentId },
    });

    const college = await this.collegeRepository.findOne({
      where: { collegeId: assignment.collegeId },
    });

    if (!student || !college) {
      return null;
    }

    const studentName = `${student.firstName} ${student.lastName}`.trim();
    const applicationTitle = college.name;

    // Build application details
    const applicationDetails: string[] = [];
    if (assignment.courseName) {
      applicationDetails.push(`Course: ${assignment.courseName}`);
    }
    if (assignment.specialization) {
      applicationDetails.push(`Specialization: ${assignment.specialization}`);
    }
    if (assignment.priorityOrder !== undefined && assignment.priorityOrder !== null) {
      applicationDetails.push(`Priority: ${assignment.priorityOrder}`);
    }
    if (assignment.applicationDate) {
      applicationDetails.push(`Application Date: ${assignment.applicationDate.toISOString().split('T')[0]}`);
    }

    // Check if application already exists for this student-college combination
    let application = await this.applicationRepository.findOne({
      where: { 
        studentId: assignment.studentId,
        applicationType: 'COLLEGE',
        applicationTitle: applicationTitle
      },
    });

    // Map assignment type to application status
    const getApplicationStatus = (assignmentType: string): 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW' => {
      switch (assignmentType) {
        case 'APPLIED':
          return 'UNDER_REVIEW';
        case 'ADMITTED':
        case 'ENROLLED':
          return 'APPROVED';
        case 'REJECTED':
          return 'REJECTED';
        case 'INTERESTED':
        case 'WAITLISTED':
        default:
          return 'PENDING';
      }
    };

    if (application) {
      // Update existing application
      application.status = getApplicationStatus(assignment.assignmentType);
      application.applicationTitle = applicationTitle;
      application.applicationDetails = applicationDetails.join('\n');
      application.updatedBy = userId;
      
      if (assignment.assignmentType === 'APPLIED' && assignment.applicationDate) {
        application.appliedDate = assignment.applicationDate;
      }
      
      if (assignment.assignmentType === 'ADMITTED' && assignment.admissionDate) {
        application.reviewedDate = assignment.admissionDate;
      }
      
      if (assignment.assignmentType === 'ENROLLED' && assignment.enrollmentDate) {
        application.reviewedDate = assignment.enrollmentDate;
      }

      return await this.applicationRepository.save(application);
    } else {
      // Create new application
      const newApplication = this.applicationRepository.create({
        studentId: assignment.studentId,
        studentName: studentName,
        applicationType: 'COLLEGE',
        applicationTitle: applicationTitle,
        applicationDetails: applicationDetails.join('\n') || undefined,
        status: getApplicationStatus(assignment.assignmentType),
        appliedDate: assignment.applicationDate || new Date(),
        createdBy: userId,
        updatedBy: userId,
      });

      return await this.applicationRepository.save(newApplication);
    }
  }

  /**
   * Assign a student to a college
   */
  async assignStudentToCollege(dto: AssignCollegeDto): Promise<StudentAssignedCollege> {
    // Check if assignment already exists
    const existingAssignment = await this.assignmentRepository.findOne({
      where: {
        studentId: dto.studentId,
        collegeId: dto.collegeId,
        assignmentStatus: 'ACTIVE',
      },
    });

    let assignment: StudentAssignedCollege;

    if (existingAssignment) {
      // Update existing assignment instead of creating a new one
      if (dto.assignmentType) {
        existingAssignment.assignmentType = dto.assignmentType;
      }
      if (dto.priorityOrder !== undefined) {
        existingAssignment.priorityOrder = dto.priorityOrder;
      }
      if (dto.courseName) {
        existingAssignment.courseName = dto.courseName;
      }
      if (dto.specialization) {
        existingAssignment.specialization = dto.specialization;
      }
      if (dto.assignedBy) {
        existingAssignment.assignedBy = dto.assignedBy;
        existingAssignment.updatedBy = dto.assignedBy;
      }
      existingAssignment.assignedDate = new Date();
      assignment = await this.assignmentRepository.save(existingAssignment);
    } else {
      // Create new assignment
      assignment = this.assignmentRepository.create({
        studentId: dto.studentId,
        collegeId: dto.collegeId,
        assignmentType: dto.assignmentType || 'INTERESTED',
        priorityOrder: dto.priorityOrder,
        courseName: dto.courseName,
        specialization: dto.specialization,
        assignedBy: dto.assignedBy,
        createdBy: dto.assignedBy || 'SYSTEM',
        updatedBy: dto.assignedBy || 'SYSTEM',
      });

      assignment = await this.assignmentRepository.save(assignment);
    }

    // Create or update application record
    try {
      await this.createOrUpdateApplication(assignment, dto.assignedBy || 'SYSTEM');
    } catch (error) {
      // Log error but don't fail the assignment creation
      this.logger.error('Error creating application record:', error);
    }

    return assignment;
  }

  /**
   * Get all college assignments for a student
   */
  async getStudentCollegeAssignments(
    studentId: string,
    includeInactive: boolean = false
  ): Promise<StudentAssignedCollege[]> {
    const queryBuilder = this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.college', 'college')
      .leftJoinAndSelect('assignment.assignedByUser', 'assignedByUser')
      .where('assignment.studentId = :studentId', { studentId });

    if (!includeInactive) {
      queryBuilder.andWhere('assignment.assignmentStatus = :status', { status: 'ACTIVE' });
    }

    return queryBuilder
      .orderBy('assignment.priorityOrder', 'ASC')
      .addOrderBy('assignment.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Get all student assignments for a college
   */
  async getCollegeStudentAssignments(
    collegeId: string,
    assignmentType?: string
  ): Promise<StudentAssignedCollege[]> {
    const queryBuilder = this.assignmentRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.student', 'student')
      .where('assignment.collegeId = :collegeId', { collegeId })
      .andWhere('assignment.assignmentStatus = :status', { status: 'ACTIVE' });

    if (assignmentType) {
      queryBuilder.andWhere('assignment.assignmentType = :assignmentType', { assignmentType });
    }

    return queryBuilder
      .orderBy('assignment.assignmentType', 'ASC')
      .addOrderBy('assignment.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Update assignment status
   */
  async updateAssignment(
    assignmentId: string,
    dto: UpdateAssignmentDto,
    updatedBy: string
  ): Promise<StudentAssignedCollege> {
    await this.assignmentRepository.update(assignmentId, {
      ...dto,
      updatedBy,
    });

    const assignment = await this.assignmentRepository.findOne({
      where: { assignmentId },
      relations: ['college', 'student', 'assignedByUser'],
    });

    // Update application record if assignment exists
    if (assignment) {
      try {
        await this.createOrUpdateApplication(assignment, updatedBy);
      } catch (error) {
        // Log error but don't fail the assignment update
        this.logger.error('Error updating application record:', error);
      }
    }

    return assignment;
  }

  /**
   * Remove student from college
   */
  async removeStudentFromCollege(studentId: string, collegeId: string): Promise<boolean> {
    const result = await this.assignmentRepository.delete({
      studentId,
      collegeId,
    });

    return result.affected > 0;
  }

  /**
   * Get student's priority list of colleges
   */
  async getStudentPriorityList(studentId: string): Promise<StudentAssignedCollege[]> {
    return this.assignmentRepository.find({
      where: {
        studentId,
        assignmentStatus: 'ACTIVE',
      },
      relations: ['college'],
      order: { priorityOrder: 'ASC' },
    });
  }

  /**
   * Update student's college priorities
   */
  async updateStudentPriorities(
    studentId: string,
    priorities: { collegeId: string; priorityOrder: number }[]
  ): Promise<boolean> {
    const queryRunner = this.assignmentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const priority of priorities) {
        await queryRunner.manager.update(
          StudentAssignedCollege,
          {
            studentId,
            collegeId: priority.collegeId,
          },
          {
            priorityOrder: priority.priorityOrder,
          }
        );
      }

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get assignment statistics by college
   */
  async getAssignmentStatistics(collegeId?: string) {
    const queryBuilder = this.assignmentRepository
      .createQueryBuilder('assignment')
      .select([
        'assignment.collegeId',
        'college.name as collegeName',
        'COUNT(CASE WHEN assignment.assignmentType = \'INTERESTED\' THEN 1 END) as interestedCount',
        'COUNT(CASE WHEN assignment.assignmentType = \'APPLIED\' THEN 1 END) as appliedCount',
        'COUNT(CASE WHEN assignment.assignmentType = \'ADMITTED\' THEN 1 END) as admittedCount',
        'COUNT(CASE WHEN assignment.assignmentType = \'ENROLLED\' THEN 1 END) as enrolledCount',
        'COUNT(CASE WHEN assignment.assignmentType = \'REJECTED\' THEN 1 END) as rejectedCount',
      ])
      .leftJoin('assignment.college', 'college')
      .where('assignment.assignmentStatus = :status', { status: 'ACTIVE' });

    if (collegeId) {
      queryBuilder.andWhere('assignment.collegeId = :collegeId', { collegeId });
    }

    return queryBuilder
      .groupBy('assignment.collegeId')
      .addGroupBy('college.name')
      .getRawMany();
  }
}