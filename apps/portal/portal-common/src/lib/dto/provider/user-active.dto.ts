 /* eslint-disable */ 
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const ActiveUserSchema = extendApi(
  z.object({
    password: z
      .string({ message: 'PasswordError' })
      .min(8, {
        message:
          'Password should contain 8 - 99 characters with at least one uppercase, lowercase, numeric and special character, white space not allowed!.',
      })
      .max(99, {
        message:
          'Password should contain 8 - 99 characters with at least one uppercase, lowercase, numeric and special character, white space not allowed!.',
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[=+\-^$*.[\]{}()?"!@#%&/\\,><':;|_~`])\S{8,99}$/,
        { message: 'Password should contain 8 - 99 characters with at least one uppercase, lowercase, numeric and special character, white space not allowed!.' }
      )
      .nonempty({ message: 'PasswordMessageError' }),
  }),
  { title: 'Active Provider Schema' }
);

export class ActiveUserDto extends createZodDto(ActiveUserSchema) {}
