import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const AuthStudentSchema = extendApi(
  z.object({
    mobilePhone: z.string().min(10, { message: 'Mobile Phone is required' }),
    otp: z
      .string()
      .max(6, { message: 'Enter Verification Code maximum 6 letters' })
      .nullable()
      .optional(),
  }),
  { title: 'Authentication schema for student' }
);

export class AuthStudentDto extends createZodDto(AuthStudentSchema) {}
