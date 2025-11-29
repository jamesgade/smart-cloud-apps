import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { BaseSchema } from '../base.dto';

export const StudentAssignRolesSchema = extendApi(
  z.object({
    studentId: z.string().optional().nullable(),
    roleId: z.string().optional().nullable(),
  }).and(BaseSchema),
  { title: 'Authentication schema for student course    ' }
);

export class AuthStudentRolesDto extends createZodDto(StudentAssignRolesSchema) {}
