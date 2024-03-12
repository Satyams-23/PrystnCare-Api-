import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../utils/ApiError';
// import bcrypt from 'bcryptjs';
import { IAuth, IAuthSignInWith, ILoginUsersResponse } from './Auth.Interface';
import exactPhoneNumberAndCode from '../../../utils/extractcountrycode';

import { Auth } from './Auth.Model';
import { Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helpers/jwt.Helpers';
import { otpgenerate } from '../../../Services/generateOTP';
// import sendEmail from '../../../utils/sendEmail';
import { User } from '../User/User.Model';

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
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Phone number not found');
  }

  if (isExistUser.otp !== payload.otp) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid OTP');
  }

  if (isExistUser.phoneNumber !== payload.phoneNumber) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Phone number');
  }

  if (isExistUser.role !== payload.role) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid role');
  }

  if (isExistUser.countryCode !== payload.countryCode) {
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

const logoutUser = async () => {
  return null;
};

export const AuthService = {
  signupWithPhoneNumber,
  signupverifyOtp,
  signinWithPhoneNumber,
  signinverifyOtp,
  logoutUser,
};
