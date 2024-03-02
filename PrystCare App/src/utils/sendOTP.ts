/* eslint-disable @typescript-eslint/no-unused-vars */
// utils/sendOtp.js
const sendOtp = (phoneNumber: string, otp: number) => {
  return new Promise<void>((resolve, _reject) => {
    // Simulate sending OTP. Replace this with your actual OTP sending mechanism.
    console.log(`Sending OTP to ${phoneNumber}: ${otp}`);

    // Simulate a delay of 2 seconds (replace this with your actual OTP sending logic)
    setTimeout(() => {
      console.log(`OTP sent to ${phoneNumber}: ${otp}`);
      resolve(); // Resolve the promise when OTP is sent successfully
    }, 2000);
  });
};

export default sendOtp;
