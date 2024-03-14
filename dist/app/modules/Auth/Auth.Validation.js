"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const User_Constant_1 = require("../User/User.Constant");
const signUpsignInZodSchema = zod_1.z.object({
    // means it is an object and it has the following properties
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'Phone number is required',
        }),
        role: zod_1.z.enum([...User_Constant_1.Role], {
            required_error: 'Role is required',
        }),
    }),
});
const otpVerifyZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string({
            required_error: 'Phone number is required',
        }),
        otp: zod_1.z.string({
            required_error: 'OTP is required',
        }),
        role: zod_1.z.enum([...User_Constant_1.Role], {
            // enum is used to restrict the value to a specific set of values in this case Role enum values are used to restrict the value of role to the values defined in Role enum
            required_error: 'Role is required',
        }),
    }),
});
//email
const registerEmail = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        role: zod_1.z.enum([...User_Constant_1.Role], {
            required_error: 'Role is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
    }),
});
const loginEmail = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
        role: zod_1.z.enum([...User_Constant_1.Role], {
            required_error: 'Role is required',
        }),
    }),
});
const forgotPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
    }),
});
const resetPassword = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({
            required_error: 'Password is required',
        }),
        confirmpassword: zod_1.z.string({
            required_error: 'Confirm Password is required',
        }),
    }),
});
exports.AuthValidation = {
    signUpsignInZodSchema,
    otpVerifyZodSchema,
    registerEmail,
    loginEmail,
    forgotPassword,
    resetPassword,
};
