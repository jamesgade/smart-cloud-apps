import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
// import { BaseSchema } from '@sma;
import { z } from 'zod';
import { BaseSchema } from '../base.dto';

export const CreateUserSchema = extendApi(
  z
    .object({
      userId: z.string().optional(),
      email: z
        .string({ message: 'pro.create.emailError' })
        .nonempty({ message: 'pro.create.emailError' })
        .email('pro.create.emailValidMessage')
        .trim()
        // .email({ message: 'pro.create.emailValidMessage' })
        .max(100, { message: 'pro.emailMaxChars' }),
        // .refine(
        //   (mail) => {
        //     let flag = false;
        //     const emailpattern =
        //       /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        //     if (mail && emailpattern.test(mail)) {
        //       flag = true;
        //     }
        //     return flag;
        //   },
        //   { message: 'pro.create.emailValidMessage' }
        // ),
      firstName: z
        .string({ message: 'pro.create.firstNameError' })
        .min(1, { message: 'pro.create.firstNameValidMessage' })
        .max(50, { message: 'pro.create.firstNameValidMessage' })
        .nonempty({ message: 'pro.create.firstNameError' }),
      middleInitial: z
        .string()
        .optional()
        .nullable()
        .refine(
          (val) => {
            if (!val || (val && val?.length <= 50)) return true;
            return false;
          },
          { message: 'pro.create.middleNameValidMessage' }
        ),
      lastName: z
        .string({ message: 'pro.create.lastNameError' })
        .min(1, { message: 'pro.create.lastNameValidMessage' })
        .max(50, { message: 'pro.create.lastNameValidMessage' })
        .nonempty({ message: 'pro.create.lastNameError' }),
      userTypeId: z
        .string({ message: 'pro.create.userTypeError' })
        .nonempty({ message: 'pro.create.userTypeError' }),
      // userTypeName: z.string().nonempty(),
      userAssignRoles: z
        .string({ message: 'pro.create.roleError' })
        .nonempty({ message: 'pro.create.roleError' }),
      status: z.string().optional().nullable()
    })
    .merge(BaseSchema),
  { title: 'Create/Update User Schema' }
);

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export class UpdateUserDto extends createZodDto(CreateUserSchema) {}