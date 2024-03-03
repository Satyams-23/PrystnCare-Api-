import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.MONGO_URL,
  password: process.env.PASSWORD,
  email: process.env.EMAIL,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  smtp_password: process.env.SMTP_PASSWORD,
  secret: process.env.SECRET,
  bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  session_secret: process.env.SESSION_SECRET,

  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
