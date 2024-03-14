"use strict";
// import otpgenrate from 'otp-generator'
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpgenerate = void 0;
function generateOTP() {
    const lenght = 4;
    let OTP = '';
    for (let i = 0; i < lenght; i++) {
        OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
}
exports.otpgenerate = { generateOTP };
