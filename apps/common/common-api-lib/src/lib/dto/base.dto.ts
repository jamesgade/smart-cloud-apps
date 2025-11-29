import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const BaseSchema = extendApi(
  z.object({
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
  { title: 'Create base schema' }
);

export class BaseDto extends createZodDto(BaseSchema) {}
