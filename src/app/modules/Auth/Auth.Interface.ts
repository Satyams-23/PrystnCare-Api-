import { NationalNumber } from 'libphonenumber-js';
import { Model, Document } from 'mongoose';

export type ILoginUsersResponse = {
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  data?: {
    _id: string;
    phoneNumber?: string;
    role: string;
    email?: string;
  };
  token?: string;
  meta?:
    | {
        accessToken?: string | undefined;
      }
    | undefined;
};

export type ITempUser = {
  phoneNumber: string | null;
  countryCode: string | null;
  otp: string | null;
  otpExpiration: Date | null;
};

export type IAuthSignInWith = {
  phoneNumber: NationalNumber;
  countryCode: string;
  otp: string;
  otpExpiration?: Date;
  role: string;
};

export type ILoginUsers = {
  email: string;
  password: string;
  phoneNumber: string;
};

export type IHashedToken = {
  hashedToken: string;
};

export type IAuth = {
  _id: string;
  email: string;
  username: string;
  password: string | undefined;
  otp: string;
  phoneNumber: string;
  countryCode: string;
  role: string;
  registerotp: string;
  loginotp: string;
  registerstatus: string;
  otpExpiration: Date;
  sessionId: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  passwordChangeAt: Date;
  confirmPassword: string;
  newPassword: string;
  expireTimeAt: Date;
  createdAt: Date;
  createPasswordResetToken(): Promise<string>;
  isPasswordMatched(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  token: string;
} & Document;

export type ILoginUser = {
  email: string;
  password: string;
};

export type AuthModel = {
  isUserExist(phoneNumber: string): Promise<IAuth | null>;
  isResetPassword(hashedToken: string): Promise<IAuth | null>;
  createPasswordResetToken(): Promise<string>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IAuth>;

// export type AuthModel = Model<IAuth, Record<string, unknown>>;
