import { Schema, model } from 'mongoose';
import { IAuth, AuthModel } from './Auth.Interface';

const userSchema = new Schema<IAuth, AuthModel>({
  email: { type: String },
  password: { type: String },
  username: { type: String },
  role: { type: String },
  phoneNumber: { type: String },
  countryCode: { type: String },
  otp: { type: String },
  otpExpiration: { type: Date },
  registerotp: { type: String },
  loginotp: { type: String },
  registerstatus: { type: String },
  sessionId: { type: String },
  confirmPassword: { type: String },
  newPassword: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  passwordChangeAt: { type: Date },
  token: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '2m' },
  },
});

userSchema.statics.isUserExist = async function (
  phoneNumber: string,
): Promise<Pick<IAuth, 'email' | 'phoneNumber' | '_id'> | null> {
  return await Auth.findOne({ phoneNumber });
};

// userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });

userSchema.pre('save', function (next: () => void) {
  // Set the expiration time to 5 minutes from now
  // this.expireTimeAt = new Date();
  // this.expireTimeAt.setMinutes(this.expireTimeAt.getMinutes() + 1);
  this.createdAt = new Date();
  next();
});

export const Auth = model<IAuth, AuthModel>('auth', userSchema);
