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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const extractcountrycode_1 = __importDefault(require("../../../utils/extractcountrycode"));
const hashpassword_1 = __importDefault(require("../../../utils/hashpassword"));
const Auth_Model_1 = require("./Auth.Model");
const jwt_Helpers_1 = require("../../../helpers/jwt.Helpers");
const generateOTP_1 = require("../../../Services/generateOTP");
const User_Model_1 = require("../User/User.Model");
const sendEmail_1 = __importDefault(require("../../../utils/sendEmail"));
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
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role, username, confirmpassword } = user;
    const existingUser = yield Auth_Model_1.Auth.findOne({ email, role });
    if (password != confirmpassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password is not matching with confirm password');
    }
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email is already registered');
    }
    else {
        const otp = generateOTP_1.otpgenerate.generateOTP();
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
        const data = yield Auth_Model_1.Auth.create({
            username: username,
            role: role,
            email: email,
            password: password,
            otp: otp,
            otpExpiration: otpExpiration,
        });
        if (!data) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'internal server error');
        }
        //send email to user
        const message = `Your OTP is ${otp} and it will expire in 1 minutes`;
        yield (0, sendEmail_1.default)(email, 'Verification Code', message);
        return tempUser;
    }
});
const verifyEmail = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, role, otp, password, confirmpassword } = payload;
    if (!email || !username || !role || !otp || !password || !confirmpassword) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, 'Email, Username, Role, Otp, and Password are required');
    }
    const isExist = yield Auth_Model_1.Auth.findOne({ email: email, role: role })
        .sort({ createdAt: -1 })
        .limit(1);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'otp expired ');
    }
    if (isExist.otp !== payload.otp) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid OTP');
    }
    if (isExist.email !== payload.email) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Email');
    }
    if (isExist.username !== payload.username) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Username');
    }
    if (isExist.role !== payload.role) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Role');
    }
    if (isExist.password !== payload.password) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Password');
    }
    const encryptedPassword = yield (0, hashpassword_1.default)(password);
    const newUser = yield User_Model_1.User.create({
        username,
        role,
        email,
        password: encryptedPassword,
    });
    if (!newUser._id) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'internal server error');
    }
    const { _id, email: userEmail, role: userRole } = newUser;
    const token = jwt_Helpers_1.jwtHelpers.createToken({ userId: _id, userEmail: userEmail, role: userRole }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        data: {
            _id: newUser._id,
            email: userEmail,
            role: userRole,
        },
        token: token,
    };
});
const registerresendotp = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role, phoneNumber } = user;
    const existingUser = yield Auth_Model_1.Auth.findOne({ email, role, phoneNumber })
        .sort({ createdAt: -1 })
        .limit(1);
    if (!existingUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const otp = generateOTP_1.otpgenerate.generateOTP();
    existingUser.otp = otp;
    existingUser.otpExpiration = new Date(Date.now() + 1 * 60 * 1000 * 60 * 24);
    const data = yield Auth_Model_1.Auth.create({
        email: email,
        role: role,
        phoneNumber: phoneNumber,
        otp: otp,
        otpExpiration: existingUser.otpExpiration,
    });
    if (!data) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'internal server error');
    }
    const message = `Your OTP is ${otp} and it will expire in 1 minutes`;
    yield (0, sendEmail_1.default)(email, 'Verification New Code', message);
    return user;
});
const loginEmailUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = user;
    const existingUser = yield User_Model_1.User.findOne({ email, role });
    if (!existingUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, existingUser.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Password');
    }
    const token = jwt_Helpers_1.jwtHelpers.createToken({
        userId: existingUser._id,
        userEmail: existingUser.email,
        role: existingUser.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        data: {
            _id: existingUser._id,
            email: existingUser.email,
            role: existingUser.role,
        },
        token: token,
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = payload;
    if (!email || !role) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, 'Email are required');
    }
    const user = yield User_Model_1.User.findOne({ email, role });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const otp = generateOTP_1.otpgenerate.generateOTP();
    const otpExpiration = new Date(Date.now() + 1 * 60 * 1000 * 60 * 24);
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    const data = yield User_Model_1.User.updateOne({
        email: email,
        role: role,
        otp: otp,
        otpExpiration: otpExpiration,
    });
    if (!data) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'internal server error');
    }
    const resetmessage = `Your Password reset OTP is ${otp} and it will expire in 1 minutes`;
    yield (0, sendEmail_1.default)(email, 'Verification Reset Password Code', resetmessage);
    return user;
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role, otp, password, confirmpassword } = payload;
    const user = yield User_Model_1.User.findOne({ email, role })
        .sort({ createdAt: -1 })
        .limit(1);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.otp !== otp) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid OTP');
    }
    if (user.otpExpiration < new Date()) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'OTP expired');
    }
    if (!password || !confirmpassword) {
        throw new ApiError_1.default(http_status_1.default.EXPECTATION_FAILED, 'New Password and Confirm Password are required');
    }
    if (password !== confirmpassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password is not matching with confirm password');
    }
    const encryptedPassword = yield (0, hashpassword_1.default)(password);
    user.password = encryptedPassword;
    user.otp = undefined; // Explicitly cast undefined to string
    user.otpExpiration = undefined; // Explicitly cast undefined to Date
    const resetmessage = `Your Password has been reset successfully`;
    yield (0, sendEmail_1.default)(email, 'Password Reset Successfully', resetmessage);
    yield user.save();
    return user; //
});
const forgotresendotp = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, role } = user;
    const existingUser = yield User_Model_1.User.findOne({ email, role });
    if (!existingUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const otp = generateOTP_1.otpgenerate.generateOTP();
    user.otp = otp;
    user.otpExpiration = new Date(Date.now() + 1 * 60 * 1000 * 60 * 24);
    yield user.save();
    const message = `Your OTP is ${otp} and it will expire in 1 minutes`;
    yield (0, sendEmail_1.default)(email, 'Verification New Code', message);
    return user;
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
    registerUser,
    verifyEmail,
    loginEmailUser,
    forgotPassword,
    resetPassword,
    registerresendotp,
    forgotresendotp,
};
