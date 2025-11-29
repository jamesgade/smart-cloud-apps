import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { AssignedStudent, Student, User } from '@smart-cloud-apps/common-api-lib';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AssignedStudentService {
  constructor(
    @InjectRepository(AssignedStudent)
    private readonly assignedStudentRepository: Repository<AssignedStudent>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AssignedStudentService.name);
  }

  async assignStudents(
    studentIds: string[],
    assignedToUserId: string,
    assignedByUserId: string,
    notes?: string,
  ) {
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
        throw new HttpException(
          'Assignment feature is not available. Please run the database migration V01_025__create_assigned_students_table.sql',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // Verify assignedTo user exists and is a counsellor/admin
      const assignedToUser = await this.userRepository.findOne({
        where: { userId: assignedToUserId },
      });

      if (!assignedToUser) {
        throw new HttpException('Assigned user not found', HttpStatus.NOT_FOUND);
      }

      const results = [];

      for (const studentId of studentIds) {
        // Verify student exists
        const student = await this.studentRepository.findOne({
          where: { studentId },
        });

        if (!student) {
          this.logger.warn(`Student ${studentId} not found, skipping`);
          continue;
        }

        // Deactivate any existing active assignment for this student
        await this.entityManager.query(
          `UPDATE common.assigned_students 
           SET assignment_status = 'INACTIVE', 
               updated_by = $1,
               updated_at = CURRENT_TIMESTAMP
           WHERE student_id = $2::uuid AND assignment_status = 'ACTIVE'`,
          [assignedByUserId, studentId],
        );

        // Create new assignment
        const assignment = this.assignedStudentRepository.create({
          studentId,
          assignedTo: assignedToUserId,
          assignedBy: assignedByUserId,
          assignmentStatus: 'ACTIVE',
          notes: notes || undefined,
          createdBy: assignedByUserId,
          updatedBy: assignedByUserId,
        });

        const savedAssignment = await this.assignedStudentRepository.save(assignment);
        results.push(savedAssignment);
      }

      return results;
    } catch (error) {
      this.logger.error('Error assigning students:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to assign students',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAssignedStudents(assignedToUserId?: string) {
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
        // Return empty array if table doesn't exist
        return [];
      }

      let query = `
        SELECT 
          a.assignment_id as "assignmentId",
          a.student_id as "studentId",
          a.assigned_to as "assignedTo",
          a.assignment_status as "assignmentStatus",
          a.assigned_by as "assignedBy",
          a.assigned_date as "assignedDate",
          a.notes,
          s.first_name as "studentFirstName",
          s.last_name as "studentLastName",
          s.mobile_phone as "studentMobilePhone",
          s.email as "studentEmail",
          u.first_name as "assignedToFirstName",
          u.last_name as "assignedToLastName",
          u.email as "assignedToEmail",
          ab.first_name as "assignedByFirstName",
          ab.last_name as "assignedByLastName"
        FROM common.assigned_students a
        LEFT JOIN student.student s ON a.student_id = s.student_id
        LEFT JOIN auth."user" u ON a.assigned_to = u.user_id
        LEFT JOIN auth."user" ab ON a.assigned_by = ab.user_id
        WHERE a.assignment_status = 'ACTIVE'
      `;

      const params: string[] = [];
      if (assignedToUserId) {
        query += ` AND a.assigned_to = $1::uuid`;
        params.push(assignedToUserId);
      }

      query += ` ORDER BY a.assigned_date DESC`;

      const results = await this.entityManager.query(query, params);

      return results.map((r: any) => ({
        assignmentId: r.assignmentId,
        studentId: r.studentId,
        assignedTo: r.assignedTo,
        assignmentStatus: r.assignmentStatus,
        assignedBy: r.assignedBy,
        assignedDate: r.assignedDate,
        notes: r.notes,
        student: {
          firstName: r.studentFirstName,
          lastName: r.studentLastName,
          mobilePhone: r.studentMobilePhone,
          email: r.studentEmail,
        },
        assignedToUser: {
          firstName: r.assignedToFirstName,
          lastName: r.assignedToLastName,
          email: r.assignedToEmail,
        },
        assignedByUser: {
          firstName: r.assignedByFirstName,
          lastName: r.assignedByLastName,
        },
      }));
    } catch (error) {
      this.logger.error('Error fetching assigned students:', error);
      throw new HttpException(
        'Failed to fetch assigned students',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAvailableCounsellors() {
    try {
      const counsellors = await this.entityManager.query(`
        SELECT DISTINCT
          u.user_id as "userId",
          u.first_name as "firstName",
          u.last_name as "lastName",
          u.email,
          r.name as "roleName"
        FROM auth."user" u
        JOIN auth.user_type ut ON u.user_type_id = ut.user_type_id
        JOIN auth.user_assign_roles uar ON u.user_id = uar.user_id
        JOIN auth.roles r ON uar.role_id = r.role_id
        WHERE r.name IN ('Admin', 'Manager', 'Senior Counsellor', 'Counsellor')
          AND u.status = 'ACTIVE'
        ORDER BY r.name, u.first_name, u.last_name
      `);

      return counsellors;
    } catch (error) {
      this.logger.error('Error fetching counsellors:', error);
      throw new HttpException(
        'Failed to fetch counsellors',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAssignedStudentsForAppointments(assignedToUserId: string) {
    try {
      // userId is now REQUIRED - all roles see only their assigned students
      if (!assignedToUserId) {
        return [];
      }

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
        // Return empty array if table doesn't exist
        return [];
      }

      // ALWAYS filter by assigned_to - userId is required
      const query = `
        SELECT 
          s.student_id as "user_id",
          s.student_id,
          s.first_name,
          s.last_name,
          s.email
        FROM common.assigned_students a
        INNER JOIN student.student s ON a.student_id = s.student_id
        WHERE a.assignment_status = 'ACTIVE'
          AND s.status = 'ACTIVE'
          AND a.assigned_to = $1::uuid
        ORDER BY s.first_name, s.last_name
      `;

      const results = await this.entityManager.query(query, [assignedToUserId]);

      return results.map((r: any) => ({
        user_id: r.user_id || r.student_id,
        first_name: r.first_name,
        last_name: r.last_name,
        email: r.email,
      }));
    } catch (error) {
      this.logger.error('Error fetching assigned students for appointments:', error);
      throw new HttpException(
        'Failed to fetch assigned students',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

