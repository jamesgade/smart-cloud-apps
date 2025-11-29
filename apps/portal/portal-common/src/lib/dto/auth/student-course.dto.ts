import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { BaseSchema } from '../base.dto';

export const CourseSchema = extendApi(
  z.object({
    studentId: z.string().optional(),
    courseId: z.string().optional(),
  }).and(BaseSchema),
  { title: 'Authentication schema for student course    ' }
);

export class AuthStudentCourseDto extends createZodDto(CourseSchema) {}
