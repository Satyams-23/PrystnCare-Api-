// import otpgenrate from 'otp-generator'

function generateOTP() {
  const lenght = 4;
  let OTP = '';
  for (let i = 0; i < lenght; i++) {
    OTP += Math.floor(Math.random() * 10);
  }
  return OTP;
}

export const otpgenerate = { generateOTP };
