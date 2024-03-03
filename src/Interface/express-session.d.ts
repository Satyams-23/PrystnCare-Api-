// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SessionData } from "express-session";

declare module "express-session" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface SessionData {
    tempUser: {
      phoneNumber?: string | null;
      countryCode?: string | null;
      otp?: string | null;
      otpExpiration?: Date | null;
      role?: string | null | undefined;

      email?: string | null;
      username?: string | null;
      password?: string | null;
    };

    user: {
      id?: string;
      displayName?: string;
      email?: string;
      role?: string;
    };
  }
}
