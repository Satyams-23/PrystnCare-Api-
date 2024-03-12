"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
// utils/sendOtp.js
const sendOtp = (phoneNumber, otp) => {
    return new Promise((resolve, _reject) => {
        // Simulate sending OTP. Replace this with your actual OTP sending mechanism.
        console.log(`Sending OTP to ${phoneNumber}: ${otp}`);
        // Simulate a delay of 2 seconds (replace this with your actual OTP sending logic)
        setTimeout(() => {
            console.log(`OTP sent to ${phoneNumber}: ${otp}`);
            resolve(); // Resolve the promise when OTP is sent successfully
        }, 2000);
    });
};
exports.default = sendOtp;
