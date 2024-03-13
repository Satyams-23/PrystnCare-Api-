import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../utils/ApiError';
import bcrypt from 'bcryptjs';
import { IAuth, IAuthSignInWith, ILoginUsersResponse } from './Auth.Interface';
import exactPhoneNumberAndCode from '../../../utils/extractcountrycode';
import passwordHash from '../../../utils/hashpassword';

import { Auth } from './Auth.Model';
import { Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helpers/jwt.Helpers';
import { otpgenerate } from '../../../Services/generateOTP';
import { User } from '../User/User.Model';
import sendEmail from '../../../utils/sendEmail';

const signupWithPhoneNumber = async (
  user: IAuth,
): Promise<IAuthSignInWith | null> => {
  const { phoneNumber: userNumber, role } = user;

  const { phoneNumber, countryCode } = exactPhoneNumberAndCode(userNumber);

  if (!phoneNumber || !countryCode) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      'Phone number and country code are required',
    );
  }

  // check if user exists
  const existingUser = await User.isNumberExist(phoneNumber);
  if (existingUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Phone Number is already registered',
    );
  } else {
    const otp = otpgenerate.generateOTP();

    const tempUser = {
      phoneNumber,
      countryCode,
      otp,
      role,
    };

    const data = await Auth.create({
      phoneNumber: phoneNumber,
      countryCode: countryCode,
      role: role,
      otp: otp,
    });

    if (!data) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'internal server error',
      );
    }
    return tempUser;
  }
};

const signupverifyOtp = async (
  payload: Partial<IAuth>,
): Promise<ILoginUsersResponse | null> => {
  const { otp, phoneNumber: userPhoneNumber, role } = payload;

  if (!userPhoneNumber) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      'Phone number is required',
    );
  }

  const { phoneNumber, countryCode } = exactPhoneNumberAndCode(userPhoneNumber);

  //validate input

  if (!otp || !phoneNumber || !countryCode || !role) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      'Phone number and OTP are required',
    );
  }

  const isExist = await Auth.findOne({ phoneNumber: phoneNumber })
    .sort({ createdAt: -1 }) //sort by created date in descending order to get the latest record
    .limit(1); //get only one record from the top of the list of sorted records

  if (!isExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'otp expired ');
  }

  if (isExist.otp !== payload.otp) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP');
  }

  if (isExist.phoneNumber !== phoneNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Phone number');
  }

  if (isExist.role !== role) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
  }

  if (isExist.countryCode !== countryCode) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid country code');
  }

  const newUser = await User.create({
    phoneNumber: phoneNumber,
    countryCode: countryCode,
    role: role,
    name: null,
    email: null,
  });

  if (!newUser._id) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'internal server error',
    );
  }

  const { _id, phoneNumber: userNumber, role: userRole } = newUser;

  const token = jwtHelpers.createToken(
    { userId: _id, userNumber: userNumber, role: userRole },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    data: {
      _id: newUser._id,
      phoneNumber: userNumber,
      role: userRole,
    },
    token: token,
  };
};

const signinWithPhoneNumber = async (
  user: IAuth,
): Promise<IAuthSignInWith | null> => {
  const { phoneNumber: userNumber, role } = user;

  const { phoneNumber, countryCode } = exactPhoneNumberAndCode(userNumber);

  if (!phoneNumber || !countryCode || !role) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      'Phone number and country code are required',
    );
  }

  const existingUser = await User.isNumberExist(phoneNumber);

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, ' User not found');
  }

  if (existingUser.role !== role) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid role');
  }

  if (existingUser?.countryCode !== countryCode) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid country code');
  }

  const otp = otpgenerate.generateOTP();

  const data = await Auth.create({
    phoneNumber: phoneNumber,
    countryCode: countryCode,
    role: role,
    otp: otp,
  });

  if (!data) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'internal server error',
    );
  }

  const tempUser = {
    phoneNumber,
    countryCode,
    otp,
    role,
  };

  return tempUser;
};

const signinverifyOtp = async (
  payload: Partial<IAuth>,
): Promise<ILoginUsersResponse | null> => {
  const { otp, phoneNumber: userPhoneNumber, role } = payload;

  if (!userPhoneNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number is required');
  }

  const { phoneNumber, countryCode } = exactPhoneNumberAndCode(userPhoneNumber);

  if (!otp || !phoneNumber || !countryCode || !role || !otp) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      'Phone number and OTP are required',
    );
  }

  const isExistUser = await Auth.findOne({ phoneNumber: phoneNumber })
    .sort({ createdAt: -1 })
    .limit(1);

  if (!isExistUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  if (isExistUser.otp !== otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
  }

  if (isExistUser.phoneNumber !== phoneNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Phone number');
  }

  if (isExistUser.role !== payload.role) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
  }

  if (isExistUser.countryCode !== countryCode) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid country code');
  }

  const accessToken = jwtHelpers.createToken(
    {
      userId: isExistUser._id,
      userNumber: isExistUser.phoneNumber,
      role: isExistUser.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    data: {
      _id: isExistUser._id,
      phoneNumber: isExistUser.phoneNumber,
      role: isExistUser.role,
    },
    token: accessToken,
  };
};

const registerUser = async (user: IAuth) => {
  const { email, password, role, username, confirmpassword } = user;
  const existingUser = await Auth.findOne({ email, role });
  if (password != confirmpassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Password is not matching with confirm password',
    );
  }
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already registered');
  } else {
    const otp = otpgenerate.generateOTP();

    const otpExpiration = new Date(Date.now() + 1 * 60 * 1000 * 60 * 24);

    user.otp = otp;
    user.otpExpiration = otpExpiration;

    const tempUser = {
      username,
      role,
      email,
      password,
      otp,
      otpExpiration,
    };

    const data = await Auth.create({
      username: username,
      role: role,
      email: email,
      password: password,
      otp: otp,
      otpExpiration: otpExpiration,
    });

    if (!data) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'internal server error',
      );
    }
    //send email to user
    const message = `Your OTP is ${otp} and it will expire in 1 minutes`;
    await sendEmail(email, 'Verification Code', message);

    return tempUser;
  }
};

const verifyEmail = async (
  payload: Partial<IAuth>,
): Promise<ILoginUsersResponse | null> => {
  const { email, username, role, otp, password, confirmpassword } = payload;

  if (!email || !username || !role || !otp || !password || !confirmpassword) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      'Email, Username, Role, Otp, and Password are required',
    );
  }

  const isExist = await Auth.findOne({ email: email, role: role })
    .sort({ createdAt: -1 })
    .limit(1);

  if (!isExist) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'otp expired ');
  }

  if (isExist.otp !== payload.otp) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP');
  }

  if (isExist.email !== payload.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Email');
  }
  if (isExist.username !== payload.username) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Username');
  }
  if (isExist.role !== payload.role) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Role');
  }
  if (isExist.password !== payload.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Password');
  }

  const encryptedPassword = await passwordHash(password);

  const newUser = await User.create({
    username,
    role,
    email,
    password: encryptedPassword,
  });
  if (!newUser._id) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'internal server error',
    );
  }

  const { _id, email: userEmail, role: userRole } = newUser;

  const token = jwtHelpers.createToken(
    { userId: _id, userEmail: userEmail, role: userRole },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    data: {
      _id: newUser._id,
      email: userEmail,
      role: userRole,
    },
    token: token,
  };
};

const loginEmailUser = async (
  user: IAuth,
): Promise<ILoginUsersResponse | null> => {
  const { email, password, role } = user;
  const existingUser = await Auth.findOne({ email, role });
  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Password');
  }

  const token = jwtHelpers.createToken(
    {
      userId: existingUser._id,
      userEmail: existingUser.email,
      role: existingUser.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    data: {
      _id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
    },
    token: token,
  };
};

const forgotPassword = async (
  payload: Partial<IAuth>,
): Promise<ILoginUsersResponse | null> => {
  const { email, role } = payload;
  if (!email || !role) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Email are required');
  }
  const user = await Auth.findOne({ email, role });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const otp = otpgenerate.generateOTP();

  const otpExpiration = new Date(Date.now() + 1 * 60 * 1000 * 60 * 24);

  user.otp = otp;
  user.otpExpiration = otpExpiration;

  const data = await User.updateOne({
    email: email,
    role: role,
    otp: otp,
    otpExpiration: otpExpiration,
  });

  if (!data) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'internal server error',
    );
  }

  const resetmessage = `Your Password reset OTP is ${otp} and it will expire in 1 minutes`;
  await sendEmail(email, 'Verification Reset Password Code', resetmessage);

  return user;
};

const resetPassword = async (
  payload: Partial<IAuth>,
): Promise<ILoginUsersResponse | null> => {
  const { email, role, otp, password, confirmpassword } = payload;

  const user = await Auth.findOne({ email, role });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.otp !== otp) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP');
  }
  if (user.otpExpiration < new Date()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'OTP expired');
  }

  if (!password || !confirmpassword) {
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      'New Password and Confirm Password are required',
    );
  }
  if (password !== confirmpassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Password is not matching with confirm password',
    );
  }
  const encryptedPassword = await passwordHash(password);
  user.password = encryptedPassword;
  user.otp = undefined as unknown as string; // Explicitly cast undefined to string
  user.otpExpiration = undefined as unknown as Date; // Explicitly cast undefined to Date

  await user.save();

  const resetmessage = `Your Password has been reset successfully`;
  await sendEmail(email, 'Password Reset Successfully', resetmessage);

  return user; //
};

const logoutUser = async () => {
  return null;
};

export const AuthService = {
  signupWithPhoneNumber,
  signupverifyOtp,
  signinWithPhoneNumber,
  signinverifyOtp,
  logoutUser,
  registerUser,
  verifyEmail,
  loginEmailUser,
  forgotPassword,
  resetPassword,
};
