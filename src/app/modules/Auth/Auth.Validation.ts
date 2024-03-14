import { z } from 'zod';
import { Role } from '../User/User.Constant';

const signUpsignInZodSchema = z.object({
  // means it is an object and it has the following properties
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone number is required',
    }),
    role: z.enum([...Role] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
  }),
});

const otpVerifyZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: 'Phone number is required',
    }),
    otp: z.string({
      required_error: 'OTP is required',
    }),
    role: z.enum([...Role] as [string, ...string[]], {
      // enum is used to restrict the value to a specific set of values in this case Role enum values are used to restrict the value of role to the values defined in Role enum
      required_error: 'Role is required',
    }),
  }),
});
//email
const registerEmail = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    role: z.enum([...Role] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const loginEmail = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
    role: z.enum([...Role] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
  }),
});

const resetPassword = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password is required',
    }),
    confirmpassword: z.string({
      required_error: 'Confirm Password is required',
    }),
  }),
});

export const AuthValidation = {
  signUpsignInZodSchema,
  otpVerifyZodSchema,
  registerEmail,
  loginEmail,
  forgotPassword,
  resetPassword,
};
