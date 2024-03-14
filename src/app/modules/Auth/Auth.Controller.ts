// import { ILoginUsersResponse } from './Auth.Interface';
import catchAsync from '../../../middleware/catchAsyncError';
import { Request, Response } from 'express';
import sendResponse from '../../../Shared/sendResponse';
import ApiError from '../../../utils/ApiError';
import { AuthService } from './Auth.Service';
import httpStatus from 'http-status';
// import sendEmail from '../../../utils/sendEmail';
// import axios from 'axios';
// import { send } from 'process';

const signupWithPhoneNumber = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;

    try {
      const result = await AuthService.signupWithPhoneNumber(data);
      if (!result) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid OTP');
      }
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OTP sent successfully',
        data: result,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: `${error}`,
      });
    }
  },
);

const signupverifyOtp = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  try {
    if (!data) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Authorization Body is missing',
      );
    }

    const result = await AuthService.signupverifyOtp(data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OTP verified successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

const signinWithPhoneNumber = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;

    try {
      const result = await AuthService.signinWithPhoneNumber(data);
      if (!result) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      }
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OTP sent successfully',
        data: result,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: `${error}`,
      });
    }
  },
);

const signinverifyOtp = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  try {
    if (!data) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Authorization Body is missing',
      );
    }

    const result = await AuthService.signinverifyOtp(data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OTP verified successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  try {
    const result = await AuthService.logoutUser();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged out successfully',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await AuthService.registerUser(data);

    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OTP sent successfully to your email address',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await AuthService.verifyEmail(data);

    if (!result) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Authorization Body is missing',
      );
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User OTP verification successful and user created',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

const loginEmailUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await AuthService.loginEmailUser(data);
    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Login Successful',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await AuthService.forgotPassword(data);
    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset OTP sent to your email address',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await AuthService.resetPassword(data);
    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset successful',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

const registerResendOtp = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await AuthService.registerresendotp(data);
    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OTP sent successfully to your email address',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

const forgotResendOtp = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await AuthService.forgotresendotp(data);
    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
      );
    }
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset OTP sent to your email address',
      data: result,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `${error}`,
    });
  }
});

export const AuthController = {
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
  registerResendOtp,
  forgotResendOtp,
};
