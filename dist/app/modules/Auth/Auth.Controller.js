"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
// import { ILoginUsersResponse } from './Auth.Interface';
const catchAsyncError_1 = __importDefault(require("../../../middleware/catchAsyncError"));
const sendResponse_1 = __importDefault(require("../../../Shared/sendResponse"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const Auth_Service_1 = require("./Auth.Service");
const http_status_1 = __importDefault(require("http-status"));
// import sendEmail from '../../../utils/sendEmail';
// import axios from 'axios';
// import { send } from 'process';
const signupWithPhoneNumber = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const result = yield Auth_Service_1.AuthService.signupWithPhoneNumber(data);
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid OTP');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'OTP sent successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
const signupverifyOtp = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        if (!data) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Authorization Body is missing');
        }
        const result = yield Auth_Service_1.AuthService.signupverifyOtp(data);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'OTP verified successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
const signinWithPhoneNumber = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const result = yield Auth_Service_1.AuthService.signinWithPhoneNumber(data);
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'OTP sent successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
const signinverifyOtp = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        if (!data) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Authorization Body is missing');
        }
        const result = yield Auth_Service_1.AuthService.signinverifyOtp(data);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'OTP verified successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
const logoutUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Auth_Service_1.AuthService.logoutUser();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User logged out successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
const registerUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const result = yield Auth_Service_1.AuthService.registerUser(data);
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'OTP sent successfully to your email address',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
const verifyEmail = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const result = yield Auth_Service_1.AuthService.verifyEmail(data);
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Authorization Body is missing');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'User OTP verification successful and user created',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
const loginEmailUser = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const result = yield Auth_Service_1.AuthService.loginEmailUser(data);
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Login Successful',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
const forgotPassword = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const result = yield Auth_Service_1.AuthService.forgotPassword(data);
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Password reset OTP sent to your email address',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
const resetPassword = (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const result = yield Auth_Service_1.AuthService.resetPassword(data);
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Password reset successful',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: `${error}`,
        });
    }
}));
exports.AuthController = {
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
