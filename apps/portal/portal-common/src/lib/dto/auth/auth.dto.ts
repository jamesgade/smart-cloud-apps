import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const AuthSchema = extendApi(
  z
    .object({
      username: z
        .string({ message: 'common.emailreq' })
        .min(1, { message: 'common.emailreq' })
        .trim()
        .refine(
          (mail) => {
            let flag = false;
            const emailpattern =
              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (mail && emailpattern.test(mail)) {
              flag = true;
            }
            return flag;
          },
          { message: 'common.emailRequired' }
        ),
      password: z.string().min(1, { message: 'common.passwdreq' }),
      path: z.string().optional(),
      otp: z
        .string()
        .max(6, { message: 'Enter Verification Code maximum 6 letters' })
        .nullable()
        .optional(),
      isotp: z.boolean().optional().default(false),
    })
    .refine(
      (data) => {
        let flag = false;
        if ((data?.isotp && data?.otp) || !data?.isotp) {
          flag = true;
        }
        return flag;
      },
      {
        message: 'common.otpreq',
        path: ['otp'],
      }
    ),
  { title: 'Authentication schema' }
);

export class AuthDto extends createZodDto(AuthSchema) {}
