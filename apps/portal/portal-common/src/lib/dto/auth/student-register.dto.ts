import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { CourseSchema } from './student-course.dto';
import { StudentAssignRolesSchema } from './student-roles.dto';
import { BaseSchema } from '../base.dto';

export const AuthStudentRegisterSchema = extendApi(
  z.object({
    mobilePhone: z.string().min(10, { message: 'Mobile Phone is required' }),
    otp: z
      .string()
      .max(6, { message: 'Enter Verification Code maximum 6 letters' })
      .nullable()
      .optional(),
    firstName: z.string().min(1, { message: 'First Name is required' }),
    lastName: z.string().min(1, { message: 'Last Name is required' }),
    middleInitial: z.string().nullable().optional(),
    email: z.string().email({ message: 'Invalid email address' }).nullable().optional(),
    state: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    referralSource: z.string().nullable().optional(),
    userTypeId: z.string().nullable().optional(),
    studentAssignRoles: z.array(StudentAssignRolesSchema).optional(),
    studentAssignCourse: z.array(CourseSchema).optional(),
    status: z.string().optional().default('ACTIVE'),
  }).and(BaseSchema),
  { title: 'Authentication schema for student' }
);

export class AuthStudentRegisterDto extends createZodDto(AuthStudentRegisterSchema) {}
