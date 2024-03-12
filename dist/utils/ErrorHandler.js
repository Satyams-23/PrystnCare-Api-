"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        // Set properties
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.operational = true;
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = ErrorHandler;
