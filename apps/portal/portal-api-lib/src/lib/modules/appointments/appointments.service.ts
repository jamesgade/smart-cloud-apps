import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Appointment, AppointmentStatus, User } from '@smart-cloud-apps/common-api-lib';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(AppointmentStatus)
    private readonly appointmentStatusRepository: Repository<AppointmentStatus>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async getAppointmentsByStudent(studentId: string) {
    try {
      const appointments = await this.entityManager.query(`
        SELECT 
          a.appointment_id,
          a.student_id,
          a.counsellor_id,
          a.title,
          a.description,
          a.appointment_date,
          a.start_time,
          a.end_time,
          a.student_notes,
          a.counsellor_notes,
          s.first_name as student_first_name,
          s.last_name as student_last_name,
          s.email as student_email,
          u.first_name as counsellor_first_name,
          u.last_name as counsellor_last_name,
          u.email as counsellor_email,
          st.status_code,
          st.status_name,
          sess.session_id,
          sess.status_id as session_status_id
        FROM counselling.appointments a
        LEFT JOIN student.student s ON a.student_id = s.student_id
        LEFT JOIN auth.user u ON a.counsellor_id = u.user_id
        LEFT JOIN counselling.appointment_status st ON a.status_id = st.status_id
        LEFT JOIN counselling.sessions sess ON a.appointment_id = sess.appointment_id
        WHERE a.student_id = $1
        ORDER BY a.appointment_date DESC, a.start_time ASC
      `, [studentId]);

      // Transform to expected format
      return appointments.map((apt: any) => ({
        appointment_id: apt.appointment_id,
        student_id: apt.student_id,
        counsellor_id: apt.counsellor_id,
        title: apt.title,
        description: apt.description,
        appointment_date: apt.appointment_date,
        start_time: apt.start_time,
        end_time: apt.end_time,
        student_notes: apt.student_notes,
        counsellor_notes: apt.counsellor_notes,
        session_id: apt.session_id,
        status: {
          status_code: apt.status_code,
          status_name: apt.status_name,
        },
        student: {
          first_name: apt.student_first_name,
          last_name: apt.student_last_name,
          email: apt.student_email,
        },
        counsellor: {
          first_name: apt.counsellor_first_name,
          last_name: apt.counsellor_last_name,
          email: apt.counsellor_email,
        },
      }));
    } catch (error) {
      console.error('Error fetching student appointments:', error);
      throw new HttpException(
        'Failed to fetch appointments',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAppointmentsByCounsellor(counsellorId: string) {
    try {
      // Check if user is admin
      const userCheck = await this.entityManager.query(`
        SELECT u.user_id, ut.name as user_type_name
        FROM auth.user u
        JOIN auth.user_type ut ON u.user_type_id = ut.user_type_id
        WHERE u.user_id = $1
      `, [counsellorId]);
      
      const isAdmin = userCheck[0]?.user_type_name === 'Admin';
      const appointments = await this.entityManager.query(`
        SELECT 
          a.appointment_id,
          a.student_id,
          a.counsellor_id,
          a.title,
          a.description,
          a.appointment_date,
          a.start_time,
          a.end_time,
          a.student_notes,
          a.counsellor_notes,
          s.first_name as student_first_name,
          s.last_name as student_last_name,
          s.email as student_email,
          u.first_name as counsellor_first_name,
          u.last_name as counsellor_last_name,
          u.email as counsellor_email,
          st.status_code,
          st.status_name,
          sess.session_id,
          sess.status_id as session_status_id
        FROM counselling.appointments a
        LEFT JOIN student.student s ON a.student_id = s.student_id
        LEFT JOIN auth.user u ON a.counsellor_id = u.user_id
        LEFT JOIN counselling.appointment_status st ON a.status_id = st.status_id
        LEFT JOIN counselling.sessions sess ON a.appointment_id = sess.appointment_id
        WHERE a.counsellor_id = $1 OR EXISTS (
          SELECT 1
          FROM auth.user_assign_roles uar
          JOIN auth.roles r ON r.role_id = uar.role_id
          WHERE uar.user_id = $1 AND r.name IN ('Admin','Manager')
        )
        ORDER BY a.appointment_date DESC, a.start_time ASC
      `, [counsellorId]);
      

      // Transform to expected format
      return appointments.map((apt: any) => ({
        appointment_id: apt.appointment_id,
        student_id: apt.student_id,
        counsellor_id: apt.counsellor_id,
        title: apt.title,
        description: apt.description,
        appointment_date: apt.appointment_date,
        start_time: apt.start_time,
        end_time: apt.end_time,
        student_notes: apt.student_notes,
        counsellor_notes: apt.counsellor_notes,
        session_id: apt.session_id,
        status: {
          status_code: apt.status_code,
          status_name: apt.status_name,
        },
        student: {
          first_name: apt.student_first_name,
          last_name: apt.student_last_name,
          email: apt.student_email,
        },
        counsellor: {
          first_name: apt.counsellor_first_name,
          last_name: apt.counsellor_last_name,
          email: apt.counsellor_email,
        },
      }));
    } catch (error) {
      console.error('Error fetching counsellor appointments:', error);
      throw new HttpException(
        'Failed to fetch appointments',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createAppointment(data: any) {
    try {
      // Validate that the student exists
      const studentExists = await this.entityManager.query(`
        SELECT student_id FROM student.student WHERE student_id = $1
      `, [data.student_id]);

      if (!studentExists || studentExists.length === 0) {
        console.error('Student not found with ID:', data.student_id);
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      // Validate that the counsellor exists
      const counsellorExists = await this.entityManager.query(`
        SELECT user_id FROM auth.user WHERE user_id = $1
      `, [data.counsellor_id]);
      
      if (!counsellorExists || counsellorExists.length === 0) {
        console.error('Counsellor not found with ID:', data.counsellor_id);
        throw new HttpException('Counsellor not found', HttpStatus.NOT_FOUND);
      }

      // Validate business hours (9:00 AM to 7:00 PM)
      const validateBusinessHours = (timeStr: string): boolean => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const timeInMinutes = hours * 60 + minutes;
        const businessStart = 9 * 60; // 9:00 AM
        const businessEnd = 19 * 60;  // 7:00 PM
        return timeInMinutes >= businessStart && timeInMinutes <= businessEnd;
      };

      if (!validateBusinessHours(data.start_time)) {
        throw new HttpException(
          'Start time must be between 9:00 AM and 7:00 PM',
          HttpStatus.BAD_REQUEST
        );
      }

      if (!validateBusinessHours(data.end_time)) {
        throw new HttpException(
          'End time must be between 9:00 AM and 7:00 PM',
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate that end time is after start time
      const [startHours, startMinutes] = data.start_time.split(':').map(Number);
      const [endHours, endMinutes] = data.end_time.split(':').map(Number);
      const startTimeInMinutes = startHours * 60 + startMinutes;
      const endTimeInMinutes = endHours * 60 + endMinutes;

      if (endTimeInMinutes <= startTimeInMinutes) {
        throw new HttpException(
          'End time must be after start time',
          HttpStatus.BAD_REQUEST
        );
      }
      // Get PENDING status
      const pendingStatus = await this.appointmentStatusRepository.findOne({
        where: { statusCode: 'PENDING' },
      });

      if (!pendingStatus) {
        throw new HttpException('Status not found', HttpStatus.NOT_FOUND);
      }

      const appointment = this.appointmentRepository.create({
        studentId: data.student_id,
        counsellorId: data.counsellor_id,
        title: data.title,
        description: data.description,
        appointmentDate: data.appointment_date,
        startTime: data.start_time,
        endTime: data.end_time,
        studentNotes: data.student_notes,
        statusId: pendingStatus.statusId,
        createdBy: data.student_id,
        updatedBy: data.student_id,
      });

      return await this.appointmentRepository.save(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new HttpException(
        error.message || 'Failed to create appointment',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async confirmAppointment(appointmentId: string, userId: string, notes?: string) {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { appointmentId },
        relations: ['status', 'counsellor', 'counsellor.userType'],
      });

      if (!appointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }

      // Get the user trying to confirm
      const user = await this.userRepository.findOne({
        where: { userId },
        relations: ['userType', 'userAssignRoles', 'userAssignRoles.role'],
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Allow confirmation if:
      // 1. User is the assigned counsellor
      // 2. User is Admin or Manager (can manage any appointments)
      const isAssignedCounsellor = appointment.counsellorId === userId;
      const userRole = user.userAssignRoles?.[0]?.role?.title;
      const isAdminOrManager = user.userType?.name === 'Admin' || 
                               userRole === 'Manager';

      if (!isAssignedCounsellor && !isAdminOrManager) {
        throw new HttpException(
          'Unauthorized: Only the assigned counsellor or admin/manager can confirm this appointment',
          HttpStatus.FORBIDDEN
        );
      }

      const confirmedStatus = await this.appointmentStatusRepository.findOne({
        where: { statusCode: 'CONFIRMED' },
      });

      if (!confirmedStatus) {
        throw new HttpException('Confirmed status not found', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Use update query to avoid relation issues
      const now = new Date();
      await this.appointmentRepository.update(
        { appointmentId },
        {
          statusId: confirmedStatus.statusId,
          confirmedAt: now,
          counsellorNotes: notes,
          updatedBy: userId,
          updatedAt: now,
        }
      );
      
      // Reload with relations to return complete data
      const updatedAppointment = await this.appointmentRepository.findOne({
        where: { appointmentId },
        relations: ['status', 'student', 'counsellor'],
      });

      return updatedAppointment;
    } catch (error) {
      console.error('Error confirming appointment:', error);
      throw new HttpException(
        error.message || 'Failed to confirm appointment',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async rejectAppointment(appointmentId: string, userId: string, reason?: string) {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { appointmentId },
        relations: ['counsellor', 'counsellor.userType'],
      });

      if (!appointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }

      // Get the user trying to reject
      const user = await this.userRepository.findOne({
        where: { userId },
        relations: ['userType', 'userAssignRoles', 'userAssignRoles.role'],
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Allow rejection if user is the assigned counsellor or admin/manager
      const isAssignedCounsellor = appointment.counsellorId === userId;
      const userRole = user.userAssignRoles?.[0]?.role?.title;
      const isAdminOrManager = user.userType?.name === 'Admin' || 
                               userRole === 'Manager';

      if (!isAssignedCounsellor && !isAdminOrManager) {
        throw new HttpException(
          'Unauthorized: Only the assigned counsellor or admin/manager can reject this appointment',
          HttpStatus.FORBIDDEN
        );
      }

      const rejectedStatus = await this.appointmentStatusRepository.findOne({
        where: { statusCode: 'REJECTED' },
      });

      if (!rejectedStatus) {
        throw new HttpException('Rejected status not found', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Use update query to avoid relation issues
      const now = new Date();
      await this.appointmentRepository.update(
        { appointmentId },
        {
          statusId: rejectedStatus.statusId,
          rejectionReason: reason,
          updatedBy: userId,
          updatedAt: now,
        }
      );
      
      // Reload with relations to return complete data
      const updatedAppointment = await this.appointmentRepository.findOne({
        where: { appointmentId },
        relations: ['status', 'student', 'counsellor'],
      });

      return updatedAppointment;
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      throw new HttpException(
        error.message || 'Failed to reject appointment',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async cancelAppointment(appointmentId: string, userId: string, reason?: string) {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { appointmentId },
      });

      if (!appointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }

      const cancelledStatus = await this.appointmentStatusRepository.findOne({
        where: { statusCode: 'CANCELLED' },
      });

      if (!cancelledStatus) {
        throw new HttpException('Cancelled status not found', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Use update query to avoid relation issues
      const now = new Date();
      await this.appointmentRepository.update(
        { appointmentId },
        {
          statusId: cancelledStatus.statusId,
          cancelledBy: userId,
          cancelledAt: now,
          cancellationReason: reason,
          updatedBy: userId,
          updatedAt: now,
        }
      );

      // Reload with relations to return complete data
      return await this.appointmentRepository.findOne({
        where: { appointmentId },
        relations: ['status', 'student', 'counsellor'],
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to cancel appointment',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteAppointment(appointmentId: string, userId: string) {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { appointmentId },
      });

      if (!appointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }

      // Only allow delete if user is the creator
      if (appointment.studentId !== userId && appointment.counsellorId !== userId) {
        throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
      }

      await this.appointmentRepository.delete(appointmentId);
      return { message: 'Appointment deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete appointment',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAvailableCounsellors() {
    try {
      const counsellors = await this.entityManager.query(`
        SELECT DISTINCT
          u.user_id,
          u.first_name,
          u.last_name,
          u.email,
          r.name as role_name
        FROM auth.user u
        INNER JOIN auth.user_assign_roles uar ON u.user_id = uar.user_id
        INNER JOIN auth.roles r ON uar.role_id = r.role_id
        WHERE r.name IN ('Counsellor', 'Senior Counsellor')
        ORDER BY u.first_name, u.last_name
      `);

      return counsellors;
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      throw new HttpException(
        'Failed to fetch counsellors',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAvailableStudents() {
    try {
      const students = await this.entityManager.query(`
        SELECT DISTINCT
          s.student_id,
          s.student_id as user_id,
          s.first_name,
          s.last_name,
          s.email
        FROM student.student s
        WHERE s.status = 'ACTIVE'
        ORDER BY s.first_name, s.last_name
      `);

      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new HttpException(
        'Failed to fetch students',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

