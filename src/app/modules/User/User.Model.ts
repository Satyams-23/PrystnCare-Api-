import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crpyto from 'crypto';

import { IUser, UserModel } from './User.Interface';
import { Role } from './User.Constant';

const userSchema = new Schema<IUser, UserModel>(
  {
    phoneNumber: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    role: {
      type: String,
      enum: Role,
    },
    otp: {
      type: String,
    },
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },

    otpExpiration: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isNumberExist = async function (
  phoneNumber: string
): Promise<Pick<IUser, 'email' | 'phoneNumber' | '_id'> | null> {
  return await User.findOne({ phoneNumber });
};

userSchema.statics.isUserExist = async function (query: {
  phoneNumber?: string | object;
  _id?: string | object;
}): Promise<Pick<IUser, 'email' | 'phoneNumber' | '_id'> | null> {
  return await User.findOne(query);
};

userSchema.statics.isResetPassword = async function (
  hashedToken: string
): Promise<IUser | null> {
  return this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.methods.createPasswordResetToken =
  async function (): // mean that this function will return a promise of string type value
  Promise<string> {
    const resetToken = crpyto.randomBytes(32).toString('hex');

    this.passwordResetToken = crpyto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.save({ validateBeforeSave: false });

    return resetToken;
  };

userSchema.methods.ChangePasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      String(this.passwordChangedAt.getTime() / 1000),
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

export const User = model<IUser, UserModel>('User', userSchema);
