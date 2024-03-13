import { Model, Document, ObjectId } from 'mongoose';
// import { Types } from 'mongoose';//

export type IHashedToken = {
  hashedToken: string;
};
export type IUser = {
  _id: string;
  email: string;
  username: string;
  password: string;
  confirmpassword: string;
  otp: string;
  phoneNumber: string;
  countryCode: string;
  role: string;
  registerotp: string;
  loginotp: string;
  registerstatus: string;
  otpExpiration: Date;
  sessionId: string;
  updatedAt: Date;
  passwordResetExpires: Date;
  passwordChangedAt: Date;
  passwordResetToken: string;

  createPasswordResetToken: () => string;
  isPasswordMatch: (candidatePassword: string, userPassword: string) => boolean;
} & Document;

export type ILoginUser = {
  email: string;
  password: string;
};
export type UserModel = {
  isUserExist(phoneNumber: string | ObjectId): Promise<IUser | null>;
  isNumberExist(phoneNumber: string): Promise<IUser | null>;
  isResetPassword(hashedToken: string): Promise<IUser | null>;
  createPasswordResetToken(): Promise<string>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
