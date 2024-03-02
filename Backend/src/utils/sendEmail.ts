import ApiError from "./ApiError";
import httpStatus from "http-status";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

dotenv.config();
const sendEmail = async (
  to: string | null | undefined,
  subject: string,
  text: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false, // Set to false to ignore self-signed certificate issues
      },
    } as nodemailer.TransportOptions);

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: to || "",
      subject: subject,
      text: text,
    };

    // Sending email

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Error sending email: ${error}`);
  }
};

export default sendEmail;
