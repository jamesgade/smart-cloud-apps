import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { UserService } from './user/user.service';
import { JWTAuthService } from './jwt/jwt-auth.service';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import * as otpGenerator from 'otp-generator';
import { UserLoginHistoryService } from './user/user-login-history.service';
import { JwtService } from '@nestjs/jwt';
import * as CryptoJS from 'crypto-js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PinoLogger } from 'nestjs-pino';
import {
  StudentOtp,
  User,
  UserOtp,
  Student,
  StudentFollowup,
} from '@smart-cloud-apps/common-api-lib';
import config from '../../config';
import {
  portalAppUsers,
  studentAppUsers,
} from 'apps/common/common-api-lib/src/lib/constants/user-type-logins.constants';
import {
  AuthStudentDto,
  AuthStudentRegisterDto,
} from '@smart-cloud-apps/portal-common';
import { StudentService } from './student/student.service';
import {
  SendGridEmailService,
  SMSService,
} from '@smart-cloud-apps/common-api-lib';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtAuthService: JWTAuthService,
    private readonly userLoginHistoryService: UserLoginHistoryService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserOtp)
    private readonly userOtpRepository: Repository<UserOtp>,
    @InjectRepository(StudentOtp)
    private readonly studentOtpRepository: Repository<StudentOtp>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(StudentFollowup)
    private readonly studentFollowupRepository: Repository<StudentFollowup>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly logger: PinoLogger,
    private readonly studentService: StudentService,
    private readonly smsService: SMSService,
    private readonly sendgridService: SendGridEmailService,
    private readonly entityManager: EntityManager
  ) {
    this.logger.setContext(AuthService.name);
  }

  async signinUser(
    email: string,
    password: string,
    path: string,
    otp: string | null,
    req: any
  ) {
    const user = await this.userService.findByEmailData(email, req);
    if (!user) {
      const _errors = { username: 'User not found.' };
      const log = `User validation failed, ${_errors}`;
      this.userLoginHistoryService.userLoginHistory(null, req, log, 'FAILED');
      throw new HttpException(log, HttpStatus.UNAUTHORIZED);
    }

    if (!this.validateUserTypeLogin(user, path)) {
      const log = `Access Denied. You are not authorized to access this site.`;
      this.userLoginHistoryService.userLoginHistory(null, req, log, 'FAILED');
      throw new HttpException(log, HttpStatus.UNAUTHORIZED);
    }

    if (!user.password) {
      const log = `Password not set for this user. Please contact administrator.`;
      this.userLoginHistoryService.userLoginHistory(user.userId, req, log, 'FAILED');
      throw new HttpException(log, HttpStatus.UNAUTHORIZED);
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      const log = `Invalid email or password.`;
      this.userLoginHistoryService.userLoginHistory(user.userId, req, log, 'FAILED');
      throw new HttpException(log, HttpStatus.UNAUTHORIZED);
    }

    const { userId, firstName, lastName, isMfa } = user;
    const userName = `${firstName} ${lastName}`;

    if (isMfa) {
      const otp = await this.generateAndSaveOTP(userId);
      await this.sendgridService.sendEmail(
        [user.email],
        this.configService.get<string>('SENDGRID_OTP_TEMPLATE_ID') || '',
        {
          name: userName || '',
          otp: otp.otp || '',
        }
      );
      return { otp: otp.otp, epoch: otp.epoch };
    }

    if (otp) {
      const otpIsValid = await this.validateOTP(userId, otp);
      if (!otpIsValid?.otpCheck) {
        const log = 'Invalid or expired verification code.';
        this.userLoginHistoryService.userLoginHistory(
          userId,
          req,
          log,
          'FAILED'
        );
        throw new HttpException(
          {
            message: log,
          },
          HttpStatus.UNAUTHORIZED
        );
      }

      this.userLoginHistoryService.userLoginHistory(
        userId,
        req,
        'OTP is verified, Login Succeeded.',
        'PASSED'
      );

      const token = await this.getTokensAndIdentifier(user);

      return {
        ...token,
      };
    } else {
      this.userLoginHistoryService.userLoginHistory(
        userId,
        req,
        'Login Succeeded.',
        'PASSED'
      );

      const token = await this.getTokensAndIdentifier(user);

      return {
        ...token,
      };
    }
  }

  async getTokensAndIdentifier(user: User) {
    const tokens = await this.jwtAuthService.getTokens(user);
    const identifier = await this.userService.updateRefreshTokenById(
      user.userId,
      tokens.refreshToken,
      undefined
    );

    return { ...tokens, identifier };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
    sessionIdentifier: string
  ) {
    if (!userId || !refreshToken) {
      throw new HttpException(`Bad request`, HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new HttpException(`Access Denied`, HttpStatus.NOT_FOUND);
    }

    const userRefreshToken = await this.userService.getRefreshTokenByUserId(
      userId,
      sessionIdentifier
    );
    if (!userRefreshToken) {
      throw new HttpException(`Access Denied`, HttpStatus.NOT_FOUND);
    }

    const refreshTokenMatches = await argon2.verify(
      userRefreshToken.refreshtoken,
      refreshToken
    );
    if (!refreshTokenMatches) {
      throw new HttpException(`Access Denied`, HttpStatus.UNAUTHORIZED);
    }

    const tokens = await this.jwtAuthService.getTokens(user);
    const identifier = await this.userService.updateRefreshTokenById(
      user.userId,
      tokens.refreshToken,
      sessionIdentifier
    );

    return { ...tokens, identifier };
  }

  async getCurrentUserInfo(req: any) {
    const userInfo = req.user;
    // Check if this is a student based on userTypeName in JWT token
    if (userInfo.userTypeName === 'Student') {
      try {
        // First, let's get basic student data
        const student = await this.studentRepository
          .createQueryBuilder('student')
          .where('student.studentId = :uId', { uId: req.user.userId })
          .getOne();
          
        if (!student) {
          const { iat, exp, ...data } = userInfo;
          return {
            ...data,
            userName: `${userInfo.firstName} ${userInfo.lastName}`,
            roleName: 'Student',
            orderBy: 5,
          };
        }

        // Now get role data using raw query to avoid relationship issues
        const roleData = await this.entityManager.query(`
          SELECT r.name as role_name, r.order_by
          FROM student.student_assign_roles sar
          INNER JOIN auth.roles r ON sar.role_id = r.role_id
          WHERE sar.student_id = $1
          LIMIT 1
        `, [req.user.userId]);
        
        const { iat, exp, ...data } = userInfo;
        const updatedData = {
          ...data,
          userName: `${student.firstName} ${student.lastName}`,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email || data.email,
          mobilePhone: (student as any).mobilePhone || (student as any).mobile_phone || data.mobilePhone,
          state: (student as any).state || data.state,
          city: (student as any).city || data.city,
          roleName: roleData[0]?.role_name || 'Student',
          orderBy: roleData[0]?.order_by || 5,
        } as any;

        return updatedData;
        
      } catch (error) {
        console.error('Error fetching student data:', error);
        
        // Fallback to JWT data if database query fails
        const { iat, exp, ...data } = userInfo;
        return {
          ...data,
          userName: `${userInfo.firstName} ${userInfo.lastName}`,
          roleName: 'Student',
          orderBy: 5,
        };
      }
    } else {
      // Fetch regular user data (existing logic)
      const userData = await this.userRepository
        .createQueryBuilder('user')
        .select([
          'roles.title as roles_name',
          'roles.orderBy as roles_order_by',
          `CONCAT(user.firstName, ' ', user.lastName) AS user_name`,
        ])
        .innerJoin('user.userAssignRoles', 'userAssignRoles')
        .innerJoin('userAssignRoles.role', 'roles')
        .where('user.userId = :uId', { uId: req.user.userId })
        .getRawOne();

      const { iat, exp, ...data } = userInfo;
      const updatedData = {
        ...data,
        userName: userData?.user_name,
        roleName: userData?.roles_name,
        orderBy: userData?.roles_order_by,
      };

      return updatedData;
    }
  }

  async logout(req: any) {
    const userId = req.user.userId;
    if (!userId) {
      throw new HttpException(`Invalid user`, HttpStatus.BAD_REQUEST);
    }

    if (req.user.path !== 'student') {
      // If ENABLE_CACHING = true, delete cache key
      if (config.ENABLE_CACHING) {
        try {
          this.cacheManager.mdel([`${userId}`]);
          const cacheKeys = this.cacheManager.stores[0];
          if (cacheKeys?.iterator) {
            for await (const [key] of cacheKeys.iterator({})) {
              await this.cacheManager.del(`${userId}:${key}`);
            }
          }
        } catch (err) {
          this.logger.warn(
            { error: 'WARN Invalid Cache', stack: undefined },
            'Cache clear failed'
          );
        }
      }

      const log = req.headers?.log ?? 'User Logged Out Manually';
      this.userLoginHistoryService.userLoginHistory(userId, req, log, 'LOGOUT');
    }

    return {
      message: 'User successfully Logout.',
      status: HttpStatus.ACCEPTED,
    };
  }

  // Helper methods for validation and OTP
  validateUserTypeLogin(user: User, path: string) {
    const userTypeId = user.userType.userTypeId;
    return this.validateUserByUserTypeId(userTypeId, path);
  }

  validateUserByUserTypeId(userTypeId: string, path: string) {
    let isValid = false;
    const normalizedPath = path?.toLowerCase().trim();

    if (
      path &&
      Object.values(portalAppUsers.appPaths).includes(normalizedPath) &&
      this.isPortalUser(userTypeId)
    ) {
      isValid = true;
    } else if (
      path &&
      Object.values(studentAppUsers.appPaths).includes(normalizedPath)
    ) {
      if (this.isStudentUser(userTypeId)) {
        isValid = true;
      }
    }

    if (isValid === false) {
      throw new HttpException(
        `Access Denied. You are not authorized to access this site.`,
        HttpStatus.UNAUTHORIZED
      );
    }

    return isValid;
  }

  isPortalUser(userTypeId: string) {
    return Object.values(portalAppUsers.userTypes).includes(userTypeId);
  }
  isStudentUser(userTypeId: string) {
    return Object.values(studentAppUsers.userTypes).includes(userTypeId);
  }

  async generateAndSaveOTP(userId: string) {
    const otp = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    const userOtpCheck = await this.userOtpRepository.findOne({
      where: { userId },
    });

    const currentDate = Date.now();
    const expiryEpoch = Math.floor((currentDate + 2 * 60000) / 1000.0);
    const userOtp = new UserOtp();
    userOtp.updatedBy = userId;
    userOtp.updatedAt = new Date();
    userOtp.expiryEpoch = expiryEpoch;
    userOtp.currentOtp = otp;
    userOtp.userId = userId;
    userOtp.otpAttempts = 0;

    if (userOtpCheck) {
      await this.userOtpRepository.update({ userId: userId }, userOtp);
    } else {
      userOtp.createdBy = userId;
      await this.userOtpRepository.insert(userOtp);
    }

    return { otp: otp, epoch: expiryEpoch };
  }

  async validateOTP(userId: string, otp: string) {
    const currentEpoch = Math.floor(Date.now() / 1000.0);
    const otpCheck = await this.userOtpRepository
      .createQueryBuilder('otp')
      .where('otp.userId = :uId', { uId: userId })
      .andWhere('otp.currentOtp = :cOtp', { cOtp: otp })
      .andWhere('otp.expiryEpoch > :eDate', { eDate: currentEpoch })
      .getOne();

    let otpAttempts = 0;

    if (!otpCheck) {
      const otpDetail = await this.userOtpRepository
        .createQueryBuilder('otp')
        .where('otp.userId = :uId', { uId: userId })
        .getOne();

      if (otpDetail) {
        otpAttempts = (otpDetail.otpAttempts ?? 0) + 1;
        await this.userOtpRepository
          .createQueryBuilder('otp')
          .update(UserOtp)
          .set({
            updatedBy: userId,
            updatedAt: new Date(),
            otpAttempts: otpAttempts,
          })
          .where('userId = :id', { id: userId })
          .execute();
      }
    }

    return { otpCheck, otpAttempts };
  }

  async signinStudent(studentDto: AuthStudentDto, req: any) {
    const student = await this.studentService.studentDataWithPhoneNumber(
      studentDto.mobilePhone
    );
    if (!student) {
      throw new HttpException(`Student not found`, HttpStatus.NOT_FOUND);
    }
    if (studentDto.otp) {
      const otpIsValid = await this.validateOTPStudent(
        studentDto.mobilePhone,
        studentDto.otp
      );
      if (!otpIsValid?.otpCheck) {
        throw new HttpException(
          `Invalid or expired verification code.`,
          HttpStatus.UNAUTHORIZED
        );
      }
      const token = await this.getClientTokens(student);
      return {
        ...token,
      };
    } else {
      const otp = await this.generateAndSaveOTPStudent(
        student.studentId,
        studentDto.mobilePhone
      );
      await this.smsService.sendOTPSMS(
        student.mobilePhone,
        this.configService.get<string>('MSG91_OTP_TEMPLATE_ID') || '',
        {
          otp: otp.otp,
        }
      );
      return { 
        message: 'Student Otp sent',
        epoch: otp.epoch 
      };
    }
  }
  async signupStudent(studentDto: AuthStudentRegisterDto, req: any) {
    const student = await this.studentService.studentDataWithPhoneNumber(
      studentDto.mobilePhone
    );
    if (student) {
      throw new HttpException(`Student already exists`, HttpStatus.BAD_REQUEST);
    }
    if (studentDto.otp) {
      const otpIsValid = await this.validateOTPStudent(
        studentDto.mobilePhone,
        studentDto.otp
      );
      if (!otpIsValid?.otpCheck) {
        throw new HttpException(
          `Invalid or expired verification code.`,
          HttpStatus.UNAUTHORIZED
        );
      }
      // Create new student using repository directly since createStudent method doesn't exist
      studentDto.userTypeId =
        studentDto.userTypeId || '2a5982f2-0dd0-496d-9b93-5a0ebf032130';
      studentDto.studentAssignRoles = studentDto.studentAssignRoles || [
        {
          roleId: '85396e7c-1bf2-40cf-a03c-744fb6b9fa9f',
          createdBy: studentDto.mobilePhone,
          updatedBy: studentDto.mobilePhone,
        },
      ];
      studentDto.status = 'ACTIVE';
      studentDto.createdBy = studentDto.mobilePhone;
      studentDto.updatedBy = studentDto.mobilePhone;
      const savedStudent = await this.studentRepository.save(
        studentDto as unknown as Student
      );
      const token = await this.getClientTokens(savedStudent);
      return {
        ...token,
      };
    } else {
      const otp = await this.generateAndSaveOTPStudent(
        null,
        studentDto.mobilePhone
      );
      await this.smsService.sendOTPSMS(
        studentDto.mobilePhone,
        this.configService.get<string>('MSG91_OTP_TEMPLATE_ID') || '',
        {
          otp: otp.otp,
          name: studentDto.firstName || '',
        }
      );
      return {
        epoch: otp.epoch,
        message: 'OTP sent successfully',
      };
    }
  }

  async getClientTokens(student: Student) {
    const tokens = await this.jwtAuthService.getClientTokens(student);
    const identifier = await this.userService.updateRefreshTokenById(
      student.studentId,
      tokens.refreshToken,
      undefined
    );

    return { ...tokens, identifier };
  }

  async generateAndSaveOTPStudent(
    studentId: string | null,
    mobilePhone: string
  ) {
    const otp = otpGenerator.generate(6, {
      digits: true,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    const studentOtpCheck = await this.studentOtpRepository.findOne({
      where: { mobilePhone },
    });

    const currentDate = Date.now();
    const expiryEpoch = Math.floor((currentDate + 2 * 60000) / 1000.0);
    const studentOtp = new StudentOtp();
    studentOtp.updatedBy = studentId || mobilePhone;
    studentOtp.mobilePhone = mobilePhone;
    studentOtp.updatedAt = new Date();
    studentOtp.expiryEpoch = expiryEpoch;
    studentOtp.currentOtp = otp;
    studentOtp.studentId = studentId || null;
    studentOtp.otpAttempts = 0;

    if (studentOtpCheck) {
      await this.studentOtpRepository.update(
        { mobilePhone: mobilePhone },
        studentOtp
      );
    } else {
      studentOtp.createdBy = studentId || mobilePhone;
      await this.studentOtpRepository.insert(studentOtp);
    }

    return { otp: otp, epoch: expiryEpoch };
  }

  async validateOTPStudent(mobilePhone: string, otp: string) {
    const currentEpoch = Math.floor(Date.now() / 1000.0);
    const otpCheck = await this.studentOtpRepository
      .createQueryBuilder('otp')
      .where('otp.mobilePhone = :uId', { uId: mobilePhone })
      .andWhere('otp.currentOtp = :cOtp', { cOtp: otp })
      .andWhere('otp.expiryEpoch > :eDate', { eDate: currentEpoch })
      .getOne();

    let otpAttempts = 0;

    if (!otpCheck) {
      const otpDetail = await this.studentOtpRepository
        .createQueryBuilder('otp')
        .where('otp.mobilePhone = :uId', { uId: mobilePhone })
        .getOne();

      if (otpDetail) {
        otpAttempts = (otpDetail.otpAttempts ?? 0) + 1;
        await this.studentOtpRepository
          .createQueryBuilder('otp')
          .update(StudentOtp)
          .set({
            updatedBy: mobilePhone,
            updatedAt: new Date(),
            otpAttempts: otpAttempts,
          })
          .where('mobilePhone = :id', { id: mobilePhone })
          .execute();
      }
    }

    return { otpCheck, otpAttempts };
  }

  async getCourses() {
    try {
      const courses = await this.entityManager.query(`
        SELECT course_id, name, description, status
        FROM student.course
        WHERE status = true
        ORDER BY name ASC
      `);
      
      return courses;
    } catch (error) {
      this.logger.error('Error fetching courses:', error);
      throw new HttpException(
        'Failed to fetch courses',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getStudents() {
    try {
      // Check if assigned_students table exists first
      const tableExists = await this.entityManager.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'common' 
          AND table_name = 'assigned_students'
        );
      `);

      const hasAssignmentTable = tableExists[0]?.exists || false;

      let query = `
        SELECT 
          s.student_id,
          s.first_name,
          s.last_name,
          s.mobile_phone,
          s.state,
          s.city,
          s.referral_source,
          s.created_at,
          s.updated_at,
          c.name as course_name,
          s.status
      `;

      if (hasAssignmentTable) {
        query += `,
          a.assigned_to as assignment_assigned_to,
          a.assignment_status as assignment_status,
          u.first_name as assigned_to_first_name,
          u.last_name as assigned_to_last_name,
          u.email as assigned_to_email
        `;
      } else {
        query += `,
          NULL as assignment_assigned_to,
          NULL as assignment_status,
          NULL as assigned_to_first_name,
          NULL as assigned_to_last_name,
          NULL as assigned_to_email
        `;
      }

      query += `
        FROM student.student s
        LEFT JOIN student.student_assign_course sac ON s.student_id = sac.student_id
        LEFT JOIN student.course c ON sac.course_id = c.course_id
      `;

      if (hasAssignmentTable) {
        query += `
        LEFT JOIN common.assigned_students a ON s.student_id = a.student_id AND a.assignment_status = 'ACTIVE'
        LEFT JOIN auth."user" u ON a.assigned_to = u.user_id
        `;
      }

      query += ` ORDER BY s.created_at DESC`;

      const students = await this.entityManager.query(query);
      
      return students;
    } catch (error) {
      this.logger.error('Error fetching students:', error);
      throw new HttpException(
        'Failed to fetch students',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createStudent(studentDto: AuthStudentRegisterDto, req: any) {
    const student = await this.studentService.studentDataWithPhoneNumber(
      studentDto.mobilePhone
    );
    if (student) {
      throw new HttpException(`Student already exists`, HttpStatus.BAD_REQUEST);
    }

    // Create student without OTP validation (admin creates student)
    studentDto.userTypeId =
      studentDto.userTypeId || '2a5982f2-0dd0-496d-9b93-5a0ebf032130';
    studentDto.studentAssignRoles = studentDto.studentAssignRoles || [
      {
        roleId: '85396e7c-1bf2-40cf-a03c-744fb6b9fa9f',
        createdBy: req.user?.userId || req.user?.email || 'ADMIN',
        updatedBy: req.user?.userId || req.user?.email || 'ADMIN',
      },
    ];
    studentDto.status = 'ACTIVE';
    studentDto.createdBy = req.user?.userId || req.user?.email || 'ADMIN';
    studentDto.updatedBy = req.user?.userId || req.user?.email || 'ADMIN';
    
    // Handle optional email - set empty string if null or undefined
    if (!studentDto.email) {
      studentDto.email = '';
    }
    
    const savedStudent = await this.studentRepository.save(
      studentDto as unknown as Student
    );
    
    return {
      studentId: savedStudent.studentId,
      firstName: savedStudent.firstName,
      lastName: savedStudent.lastName,
      email: savedStudent.email,
      mobilePhone: savedStudent.mobilePhone,
      state: savedStudent.state,
      city: savedStudent.city,
    };
  }

  async getStudentById(studentId: string) {
    try {
      // Get student basic info
      const student = await this.studentRepository.findOne({
        where: { studentId },
      });

      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      // Get course assignment
      const courseAssignment = await this.entityManager.query(`
        SELECT 
          c.course_id,
          c.name as course_name,
          c.description as course_description
        FROM student.student_assign_course sac
        LEFT JOIN student.course c ON sac.course_id = c.course_id
        WHERE sac.student_id = $1
        LIMIT 1
      `, [studentId]);

      // Get applications
      const applications = await this.entityManager.query(`
        SELECT 
          a.application_id,
          a.application_type,
          a.application_title,
          a.application_details,
          a.status,
          a.applied_date,
          a.reviewed_date,
          a.review_notes
        FROM applications.applications a
        WHERE a.student_id = $1
        ORDER BY a.applied_date DESC
      `, [studentId]);

      // Get assigned colleges
      const colleges = await this.entityManager.query(`
        SELECT 
          c.college_id,
          c.name,
          c.type,
          c.state,
          c.city,
          c.fees,
          c.rating
        FROM common.student_assigned_colleges sac
        JOIN common.colleges c ON sac.college_id = c.college_id
        WHERE sac.student_id = $1
          AND sac.assignment_status = 'ACTIVE'
        ORDER BY sac.created_at DESC
      `, [studentId]);

      // Get followups
      const followups = await this.studentFollowupRepository.find({
        where: { studentId },
        order: { followupDate: 'DESC' },
      });

      return {
        student: {
          studentId: student.studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          middleInitial: student.middleInitial || '',
          email: student.email || '',
          mobilePhone: student.mobilePhone,
          state: student.state,
          city: student.city,
          referralSource: student.referralSource || null,
          status: student.status,
          courseName: courseAssignment[0]?.course_name || null,
          courseId: courseAssignment[0]?.course_id || null,
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        },
        applications,
        colleges,
        followups,
      };
    } catch (error) {
      this.logger.error('Error fetching student details:', error);
      throw new HttpException(
        'Failed to fetch student details',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateStudent(studentId: string, studentDto: AuthStudentRegisterDto, req: any) {
    try {
      const student = await this.studentRepository.findOne({
        where: { studentId },
      });

      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      // Update student fields
      if (studentDto.firstName) student.firstName = studentDto.firstName;
      if (studentDto.lastName) student.lastName = studentDto.lastName;
      if (studentDto.middleInitial !== undefined) student.middleInitial = studentDto.middleInitial || '';
      if (studentDto.email !== undefined) student.email = studentDto.email || '';
      if (studentDto.mobilePhone) student.mobilePhone = studentDto.mobilePhone;
      if (studentDto.state !== undefined) student.state = studentDto.state || '';
      if (studentDto.city !== undefined) student.city = studentDto.city || '';
      if (studentDto.referralSource !== undefined) {
        student.referralSource = studentDto.referralSource || undefined;
      }
      if (studentDto.status) student.status = studentDto.status as 'ACTIVE' | 'IN-ACTIVE';
      student.updatedBy = req.user?.userId || req.user?.email || 'ADMIN';

      // Update course assignment if provided
      if (studentDto.studentAssignCourse && studentDto.studentAssignCourse.length > 0) {
        // Remove existing course assignments
        await this.entityManager.query(
          `DELETE FROM student.student_assign_course WHERE student_id = $1`,
          [studentId]
        );

        // Add new course assignments
        for (const course of studentDto.studentAssignCourse) {
          await this.entityManager.query(
            `INSERT INTO student.student_assign_course (student_id, course_id, created_by, updated_by)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT DO NOTHING`,
            [
              studentId,
              course.courseId,
              req.user?.userId || req.user?.email || 'ADMIN',
              req.user?.userId || req.user?.email || 'ADMIN',
            ]
          );
        }
      }

      const updatedStudent = await this.studentRepository.save(student);

      return {
        studentId: updatedStudent.studentId,
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        middleInitial: updatedStudent.middleInitial,
        email: updatedStudent.email,
        mobilePhone: updatedStudent.mobilePhone,
        state: updatedStudent.state,
        city: updatedStudent.city,
        status: updatedStudent.status,
      };
    } catch (error) {
      this.logger.error('Error updating student:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update student',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteStudent(studentId: string, req: any) {
    try {
      const student = await this.studentRepository.findOne({
        where: { studentId },
      });

      if (!student) {
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }

      // Soft delete - set status to IN-ACTIVE
      student.status = 'IN-ACTIVE';
      student.updatedBy = req.user?.userId || req.user?.email || 'ADMIN';
      await this.studentRepository.save(student);

      return {
        success: true,
        message: 'Student deleted successfully',
      };
    } catch (error) {
      this.logger.error('Error deleting student:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete student',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getStudentFollowups(studentId: string) {
    try {
      const followups = await this.studentFollowupRepository.find({
        where: { studentId },
        order: { followupDate: 'DESC' },
      });
      return followups;
    } catch (error) {
      this.logger.error('Error fetching student followups:', error);
      throw new HttpException(
        'Failed to fetch followups',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createFollowup(studentId: string, followupDto: any, req: any) {
    try {
      const followup = this.studentFollowupRepository.create({
        studentId,
        followupType: followupDto.followupType,
        followupDate: followupDto.followupDate,
        notes: followupDto.notes,
        counsellorId: req.user?.userId || null,
        nextFollowupDate: followupDto.nextFollowupDate || null,
        status: followupDto.status || 'SCHEDULED',
        createdBy: req.user?.userId || req.user?.email || 'ADMIN',
        updatedBy: req.user?.userId || req.user?.email || 'ADMIN',
      });

      const savedFollowup = await this.studentFollowupRepository.save(followup);
      return savedFollowup;
    } catch (error) {
      this.logger.error('Error creating followup:', error);
      throw new HttpException(
        'Failed to create followup',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateFollowup(followupId: string, followupDto: any, req: any) {
    try {
      const followup = await this.studentFollowupRepository.findOne({
        where: { followupId },
      });

      if (!followup) {
        throw new HttpException('Followup not found', HttpStatus.NOT_FOUND);
      }

      if (followupDto.followupType) followup.followupType = followupDto.followupType;
      if (followupDto.followupDate) followup.followupDate = followupDto.followupDate;
      if (followupDto.notes !== undefined) followup.notes = followupDto.notes;
      if (followupDto.nextFollowupDate !== undefined) followup.nextFollowupDate = followupDto.nextFollowupDate;
      if (followupDto.status) followup.status = followupDto.status;
      followup.updatedBy = req.user?.userId || req.user?.email || 'ADMIN';

      const updatedFollowup = await this.studentFollowupRepository.save(followup);
      return updatedFollowup;
    } catch (error) {
      this.logger.error('Error updating followup:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update followup',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteFollowup(followupId: string) {
    try {
      const result = await this.studentFollowupRepository.delete(followupId);
      return {
        success: (result?.affected ?? 0) > 0,
        message: 'Followup deleted successfully',
      };
    } catch (error) {
      this.logger.error('Error deleting followup:', error);
      throw new HttpException(
        'Failed to delete followup',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUpcomingFollowups(counsellorId: string, minutesAhead: number = 30) {
    try {
      const now = new Date();
      const futureTime = new Date(now.getTime() + minutesAhead * 60 * 1000);
      const pastTime = new Date(now.getTime() - 5 * 60 * 1000);

      // Get followups that are due now or upcoming (within next 30 minutes)
      const followups = await this.entityManager.query(`
        SELECT 
          f.followup_id as "followupId",
          f.student_id as "studentId",
          f.followup_type as "followupType",
          f.followup_date as "followupDate",
          f.notes,
          f.status,
          f.next_followup_date as "nextFollowupDate",
          s.first_name as "studentFirstName",
          s.last_name as "studentLastName",
          s.mobile_phone as "studentMobilePhone"
        FROM student.student_followup f
        LEFT JOIN student.student s ON f.student_id = s.student_id
        WHERE f.status = 'SCHEDULED'
          AND f.followup_date >= $1
          AND f.followup_date <= $2
          AND (f.counsellor_id = $3::uuid OR f.counsellor_id IS NULL)
        ORDER BY f.followup_date ASC
      `, [pastTime, futureTime, counsellorId]);

      // Also check for admin users - they should see all followups
      const userCheck = await this.entityManager.query(`
        SELECT ut.name as user_type_name
        FROM auth.user u
        JOIN auth.user_type ut ON u.user_type_id = ut.user_type_id
        WHERE u.user_id = $1
      `, [counsellorId]);

      const isAdmin = userCheck[0]?.user_type_name === 'Admin';
      
      if (isAdmin) {
        // Admins see all followups
        const adminFollowups = await this.entityManager.query(`
          SELECT 
            f.followup_id as "followupId",
            f.student_id as "studentId",
            f.followup_type as "followupType",
            f.followup_date as "followupDate",
            f.notes,
            f.status,
            f.next_followup_date as "nextFollowupDate",
            s.first_name as "studentFirstName",
            s.last_name as "studentLastName",
            s.mobile_phone as "studentMobilePhone"
          FROM student.student_followup f
          LEFT JOIN student.student s ON f.student_id = s.student_id
          WHERE f.status = 'SCHEDULED'
            AND f.followup_date >= $1
            AND f.followup_date <= $2
          ORDER BY f.followup_date ASC
        `, [pastTime, futureTime]);
        
        return adminFollowups.map((f: any) => ({
          followupId: f.followupId,
          studentId: f.studentId,
          followupType: f.followupType,
          followupDate: f.followupDate,
          notes: f.notes,
          status: f.status,
          nextFollowupDate: f.nextFollowupDate,
          student: f.studentFirstName ? {
            firstName: f.studentFirstName,
            lastName: f.studentLastName,
            mobilePhone: f.studentMobilePhone,
          } : null,
        }));
      }

      return followups.map((f: any) => ({
        followupId: f.followupId,
        studentId: f.studentId,
        followupType: f.followupType,
        followupDate: f.followupDate,
        notes: f.notes,
        status: f.status,
        nextFollowupDate: f.nextFollowupDate,
        student: f.studentFirstName ? {
          firstName: f.studentFirstName,
          lastName: f.studentLastName,
          mobilePhone: f.studentMobilePhone,
        } : null,
      }));
    } catch (error) {
      this.logger.error('Error fetching upcoming followups:', error);
      throw new HttpException(
        'Failed to fetch upcoming followups',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAssignedStudentsFollowups(userId: string) {
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

      // Determine if user should see ALL followups (Admin/Manager roles)
      const roleCheck = await this.entityManager.query(`
        SELECT 1
        FROM auth.user_assign_roles uar
        JOIN auth.roles r ON r.role_id = uar.role_id
        WHERE uar.user_id = $1::uuid AND r.name IN ('Admin','Manager')
        LIMIT 1
      `, [userId]);

      const isAdminOrManager = roleCheck && roleCheck.length > 0;

      // Build base query - for Admin/Manager return all followups; otherwise only assigned
      const query = isAdminOrManager ? `
        SELECT 
          f.followup_id as "followupId",
          f.student_id as "studentId",
          f.followup_type as "followupType",
          f.followup_date as "followupDate",
          f.notes,
          f.status,
          f.next_followup_date as "nextFollowupDate",
          s.first_name as "studentFirstName",
          s.last_name as "studentLastName",
          s.mobile_phone as "studentMobilePhone",
          s.email as "studentEmail",
          s.state as "studentState",
          s.city as "studentCity",
          s.status as "studentStatus",
          c.name as "courseName",
          a.assigned_to as "assignedTo",
          CONCAT(au.first_name, ' ', au.last_name) as "assignedToName"
        FROM student.student_followup f
        LEFT JOIN student.student s ON f.student_id = s.student_id
        LEFT JOIN student.student_assign_course sac ON s.student_id = sac.student_id
        LEFT JOIN student.course c ON sac.course_id = c.course_id
        LEFT JOIN common.assigned_students a ON f.student_id = a.student_id AND a.assignment_status = 'ACTIVE'
        LEFT JOIN auth."user" au ON a.assigned_to = au.user_id
        ORDER BY f.followup_date DESC
      ` : `
        SELECT 
          f.followup_id as "followupId",
          f.student_id as "studentId",
          f.followup_type as "followupType",
          f.followup_date as "followupDate",
          f.notes,
          f.status,
          f.next_followup_date as "nextFollowupDate",
          s.first_name as "studentFirstName",
          s.last_name as "studentLastName",
          s.mobile_phone as "studentMobilePhone",
          s.email as "studentEmail",
          s.state as "studentState",
          s.city as "studentCity",
          s.status as "studentStatus",
          c.name as "courseName",
          a.assigned_to as "assignedTo",
          CONCAT(au.first_name, ' ', au.last_name) as "assignedToName"
        FROM student.student_followup f
        INNER JOIN common.assigned_students a ON f.student_id = a.student_id AND a.assignment_status = 'ACTIVE'
        LEFT JOIN student.student s ON f.student_id = s.student_id
        LEFT JOIN student.student_assign_course sac ON s.student_id = sac.student_id
        LEFT JOIN student.course c ON sac.course_id = c.course_id
        LEFT JOIN auth."user" au ON a.assigned_to = au.user_id
        WHERE a.assigned_to = $1::uuid
        ORDER BY f.followup_date DESC
      `;

      const results = isAdminOrManager
        ? await this.entityManager.query(query)
        : await this.entityManager.query(query, [userId]);

      return results.map((r: any) => ({
        followupId: r.followupId,
        studentId: r.studentId,
        followupType: r.followupType,
        followupDate: r.followupDate,
        notes: r.notes,
        status: r.status,
        nextFollowupDate: r.nextFollowupDate,
        student: {
          firstName: r.studentFirstName,
          lastName: r.studentLastName,
          mobilePhone: r.studentMobilePhone,
          email: r.studentEmail,
          state: r.studentState,
          city: r.studentCity,
          status: r.studentStatus,
          courseName: r.courseName,
        },
        assignedTo: r.assignedTo || null,
        assignedToName: r.assignedToName || null,
      }));
    } catch (error) {
      this.logger.error('Error fetching assigned students followups:', error);
      throw new HttpException(
        'Failed to fetch assigned students followups',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async forgotPassword(email: string, req: any) {
    try {
      // Check if user exists in database
      const user = await this.userRepository.findOne({
        where: { email: email.toLowerCase() },
        relations: ['userType']
      });

      if (!user) {
        throw new HttpException(
          'User with this email does not exist',
          HttpStatus.NOT_FOUND
        );
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = Date.now() + (10 * 60 * 1000); // 10 minutes from now

      // Save OTP to database
      await this.userOtpRepository.upsert({
        userId: user.userId,
        currentOtp: otp,
        expiryEpoch: Math.floor(expiryTime / 1000),
        otpAttempts: 0,
        captcha: null,
        createdBy: user.userId,
        updatedBy: user.userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }, ['userId']);

      // Send OTP email using SendGrid
      try {
        const templateId = 'd-42d8f8c500684b429fbd0f617e5e4dd9';//forgot password template id sendgrid
        const dynamicData = {
          name: `${user.firstName} ${user.lastName}`,
          otp: otp
        };

        await this.sendgridService.sendEmail(
          [email.toLowerCase()],
          templateId,
          dynamicData,
          'Campus Yatra'
        );

        this.logger.info(`OTP sent successfully to email: ${email}`);
      } catch (emailError) {
        this.logger.error('Error sending OTP email:', emailError);
        throw new HttpException(
          'Failed to send OTP email. Please try again.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return {
        success: true,
        message: 'OTP has been sent to your email address. Please check your inbox.',
      };
    } catch (error) {
      this.logger.error('Error in forgot password:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to process forgot password request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetPasswordWithOtp(email: string, otp: string, password: string, confirmPassword: string, req: any) {
    try {
      // Validate password match
      if (password !== confirmPassword) {
        throw new HttpException(
          'Password and confirm password do not match',
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if user exists in database
      const user = await this.userRepository.findOne({
        where: { email: email.toLowerCase() },
        relations: ['userType']
      });

      if (!user) {
        throw new HttpException(
          'User with this email does not exist',
          HttpStatus.NOT_FOUND
        );
      }

      // Verify OTP
      const userOtp = await this.userOtpRepository.findOne({
        where: { userId: user.userId }
      });

      if (!userOtp) {
        throw new HttpException(
          'No OTP found for this user. Please request a new OTP.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if OTP has expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > userOtp.expiryEpoch) {
        throw new HttpException(
          'OTP has expired. Please request a new OTP.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if OTP matches
      if (userOtp.currentOtp !== otp) {
        // Increment attempt count
        await this.userOtpRepository.update(
          { userId: user.userId },
          { otpAttempts: userOtp.otpAttempts + 1 }
        );

        if (userOtp.otpAttempts >= 2) {
          // Delete OTP after 3 failed attempts
          await this.userOtpRepository.delete({ userId: user.userId });
          throw new HttpException(
            'Too many failed attempts. Please request a new OTP.',
            HttpStatus.BAD_REQUEST
          );
        }

        throw new HttpException(
          'Invalid OTP. Please try again.',
          HttpStatus.BAD_REQUEST
        );
      }

      // Hash the new password using bcrypt
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update password in database
      try {
        await this.userRepository.update(
          { userId: user.userId },
          { 
            password: hashedPassword, 
            updatedBy: user.userId, 
            updatedAt: new Date() 
          }
        );
        this.logger.info(`Password updated successfully in database for email: ${email}`);
      } catch (dbError) {
        this.logger.error('Error updating password in database:', dbError);
        throw new HttpException(
          'Failed to update password in database',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      // Delete used OTP
      await this.userOtpRepository.delete({ userId: user.userId });

      // Log the successful password reset
      this.logger.info(`Password reset completed for email: ${email}`);

      return {
        success: true,
        message: 'Password has been successfully updated.',
      };
    } catch (error) {
      this.logger.error('Error in reset password with OTP:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to process password reset request',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetPassword(token: string, newPassword: string, req: any) {
    try {
      // For now, just return a simple message
      // In the future, you can implement actual token validation and password reset
      this.logger.info(`Password reset attempt with token: ${token.substring(0, 6)}...`);

      return {
        success: true,
        message: 'Password reset functionality is currently under development. Please contact your administrator.',
      };
    } catch (error) {
      this.logger.error('Error in reset password:', error);
      throw new HttpException(
        'Failed to reset password',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async resendOtpStudentLogin(mobilePhone: string, req: any) {
    const student = await this.studentService.studentDataWithPhoneNumber(mobilePhone);
    if (!student) {
      throw new HttpException(`Student not found`, HttpStatus.NOT_FOUND);
    }

    // Check if there's an existing OTP that's still valid (not expired)
    const currentEpoch = Math.floor(Date.now() / 1000.0);
    const existingOtp = await this.studentOtpRepository
      .createQueryBuilder('otp')
      .where('otp.mobilePhone = :phone', { phone: mobilePhone })
      .andWhere('otp.expiryEpoch > :currentTime', { currentTime: currentEpoch })
      .getOne();

    // If there's a valid OTP that was created less than 30 seconds ago, reject resend request
    if (existingOtp) {
      const otpCreatedTime = existingOtp.expiryEpoch - (2 * 60); // OTP expires after 2 minutes
      const thirtySecondsAgo = currentEpoch - 30;
      
      if (otpCreatedTime > thirtySecondsAgo) {
        throw new HttpException(
          'Please wait at least 30 seconds before requesting a new OTP',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
    }

    const otp = await this.generateAndSaveOTPStudent(student.studentId, mobilePhone);
    await this.smsService.sendOTPSMS(
      mobilePhone,
      this.configService.get<string>('MSG91_OTP_TEMPLATE_ID') || '',
      {
        otp: otp.otp,
      }
    );

    return { 
      message: 'OTP resent successfully',
      epoch: otp.epoch 
    };
  }

  async resendOtpStudentRegister(mobilePhone: string, req: any) {
    // Check if student already exists
    const student = await this.studentService.studentDataWithPhoneNumber(mobilePhone);
    if (student) {
      throw new HttpException(`Student already exists`, HttpStatus.BAD_REQUEST);
    }

    // Check if there's an existing OTP that's still valid (not expired)
    const currentEpoch = Math.floor(Date.now() / 1000.0);
    const existingOtp = await this.studentOtpRepository
      .createQueryBuilder('otp')
      .where('otp.mobilePhone = :phone', { phone: mobilePhone })
      .andWhere('otp.expiryEpoch > :currentTime', { currentTime: currentEpoch })
      .getOne();

    // If there's a valid OTP that was created less than 30 seconds ago, reject resend request
    if (existingOtp) {
      const otpCreatedTime = existingOtp.expiryEpoch - (2 * 60); // OTP expires after 2 minutes
      const thirtySecondsAgo = currentEpoch - 30;
      
      if (otpCreatedTime > thirtySecondsAgo) {
        throw new HttpException(
          'Please wait at least 30 seconds before requesting a new OTP',
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
    }

    const otp = await this.generateAndSaveOTPStudent(null, mobilePhone);
    await this.smsService.sendOTPSMS(
      mobilePhone,
      this.configService.get<string>('MSG91_OTP_TEMPLATE_ID') || '',
      {
        otp: otp.otp,
      }
    );

    return {
      message: 'OTP resent successfully',
      epoch: otp.epoch
    };
  }
}