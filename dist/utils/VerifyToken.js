"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const config_1 = __importDefault(require("../config"));
const jwt_Helpers_1 = require("../helpers/jwt.Helpers");
const ApiError_1 = __importDefault(require("./ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const verifyToken = (token) => {
    let verifiedToken = null; //
    // Verify token
    try {
        verifiedToken = jwt_Helpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid Token");
    }
    return verifiedToken;
};
exports.verifyToken = verifyToken;
