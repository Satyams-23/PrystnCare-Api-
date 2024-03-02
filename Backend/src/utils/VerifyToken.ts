import { Secret } from "jsonwebtoken";
import config from "../config";
import { jwtHelpers } from "../helpers/jwt.Helpers";
import ApiError from "./ApiError";
import httpStatus from "http-status";

export const verifyToken = (token: string) => {
  let verifiedToken = null; //
  // Verify token
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid Token");
  }

  return verifiedToken;
};
