class ErrorHandler extends Error {
  operational: boolean;
  status: string;
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    // Set properties
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.operational = true;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
