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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../utils/ApiError"));
const extractcountrycode_1 = __importDefault(require("../../../utils/extractcountrycode"));
const Auth_Model_1 = require("./Auth.Model");
const jwt_Helpers_1 = require("../../../helpers/jwt.Helpers");
const generateOTP_1 = require("../../../Services/generateOTP");
// import sendEmail from '../../../utils/sendEmail';
const User_Model_1 = require("../User/User.Model");
const signupWithPhoneNumber = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber: userNumber, role } = user;
    const { phoneNumber, countryCode } = (0, extractcountrycode_1.default)(userNumber);
    if (!phoneNumber || !countryCode) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, 'Phone number and country code are required');
    }
    // check if user exists
    const existingUser = yield User_Model_1.User.isNumberExist(phoneNumber);
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Phone Number is already registered');
    }
    else {
        const otp = generateOTP_1.otpgenerate.generateOTP();
        const tempUser = {
            phoneNumber,
            countryCode,
            otp,
            role,
        };
        const data = yield Auth_Model_1.Auth.create({
            phoneNumber: phoneNumber,
            countryCode: countryCode,
            role: role,
            otp: otp,
        });
        if (!data) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'internal server error');
        }
        return tempUser;
    }
});
const signupverifyOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, phoneNumber: userPhoneNumber, role } = payload;
    if (!userPhoneNumber) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, 'Phone number is required');
    }
    const { phoneNumber, countryCode } = (0, extractcountrycode_1.default)(userPhoneNumber);
    //validate input
    if (!otp || !phoneNumber || !countryCode || !role) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, 'Phone number and OTP are required');
    }
    const isExist = yield Auth_Model_1.Auth.findOne({ phoneNumber: phoneNumber })
        .sort({ createdAt: -1 }) //sort by created date in descending order to get the latest record
        .limit(1); //get only one record from the top of the list of sorted records
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'otp expired ');
    }
    if (isExist.otp !== payload.otp) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid OTP');
    }
    if (isExist.phoneNumber !== phoneNumber) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Phone number');
    }
    if (isExist.role !== role) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid role');
    }
    if (isExist.countryCode !== countryCode) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid country code');
    }
    const newUser = yield User_Model_1.User.create({
        phoneNumber: phoneNumber,
        countryCode: countryCode,
        role: role,
        name: null,
        email: null,
    });
    if (!newUser._id) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'internal server error');
    }
    const { _id, phoneNumber: userNumber, role: userRole } = newUser;
    const token = jwt_Helpers_1.jwtHelpers.createToken({ userId: _id, userNumber: userNumber, role: userRole }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        data: {
            _id: newUser._id,
            phoneNumber: userNumber,
            role: userRole,
        },
        token: token,
    };
});
const signinWithPhoneNumber = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber: userNumber, role } = user;
    const { phoneNumber, countryCode } = (0, extractcountrycode_1.default)(userNumber);
    if (!phoneNumber || !countryCode || !role) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, 'Phone number and country code are required');
    }
    const existingUser = yield User_Model_1.User.isNumberExist(phoneNumber);
    if (!existingUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, ' User not found');
    }
    if (existingUser.role !== role) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid role');
    }
    if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.countryCode) !== countryCode) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid country code');
    }
    const otp = generateOTP_1.otpgenerate.generateOTP();
    const data = yield Auth_Model_1.Auth.create({
        phoneNumber: phoneNumber,
        countryCode: countryCode,
        role: role,
        otp: otp,
    });
    if (!data) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'internal server error');
    }
    const tempUser = {
        phoneNumber,
        countryCode,
        otp,
        role,
    };
    return tempUser;
});
const signinverifyOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, phoneNumber: userPhoneNumber, role } = payload;
    if (!userPhoneNumber) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Phone number is required');
    }
    const { phoneNumber, countryCode } = (0, extractcountrycode_1.default)(userPhoneNumber);
    if (!otp || !phoneNumber || !countryCode || !role || !otp) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, 'Phone number and OTP are required');
    }
    const isExistUser = yield Auth_Model_1.Auth.findOne({ phoneNumber: phoneNumber })
        .sort({ createdAt: -1 })
        .limit(1);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    if (isExistUser.otp !== otp) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid OTP');
    }
    if (isExistUser.phoneNumber !== phoneNumber) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Phone number');
    }
    if (isExistUser.role !== payload.role) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid role');
    }
    if (isExistUser.countryCode !== countryCode) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid country code');
    }
    const accessToken = jwt_Helpers_1.jwtHelpers.createToken({
        userId: isExistUser._id,
        userNumber: isExistUser.phoneNumber,
        role: isExistUser.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        data: {
            _id: isExistUser._id,
            phoneNumber: isExistUser.phoneNumber,
            role: isExistUser.role,
        },
        token: accessToken,
    };
});
const logoutUser = () => __awaiter(void 0, void 0, void 0, function* () {
    return null;
});
exports.AuthService = {
    signupWithPhoneNumber,
    signupverifyOtp,
    signinWithPhoneNumber,
    signinverifyOtp,
    logoutUser,
};
