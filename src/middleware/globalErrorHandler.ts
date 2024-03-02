/* eslint-disable no-console */
import { ErrorRequestHandler } from "express";
import handleValidationError from "../errors/handleValidationError";

import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleCastError from "../errors/handleCastError";
import config from "../config";
import { IGenericErrorMessage } from "../Interface/error";
import ApiError from "../utils/ApiError";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // eslint-disable-next-line no-unused-expressions
  config.env === "development"
    ? console.log("GlobalErrorHandler ~~", error)
    : console.log("GlobalErrorHander", error);

  let statusCode = 500;
  let message = "something went wrong !";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error?.name === "validationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    errorMessages = simplifiedError.errorMessages;
  } else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? error?.stack : undefined,
  });
  next();
};

export default globalErrorHandler;
