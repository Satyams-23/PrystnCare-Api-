"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Auth_Controller_1 = require("./Auth.Controller");
const validateRequest_1 = __importDefault(require("../../../middleware/validateRequest"));
const Auth_Validation_1 = require("./Auth.Validation");
const cors_1 = __importDefault(require("cors"));
// import { Auth } from './Auth.Model';
const router = express_1.default.Router();
router.post('/logout', Auth_Controller_1.AuthController.logoutUser);
router.post('/signup', 
// validateRequest(AuthValidation.signUpsignInZodSchema),
Auth_Controller_1.AuthController.signupWithPhoneNumber);
router.post('/signupverifyotp', (0, cors_1.default)(), (0, validateRequest_1.default)(Auth_Validation_1.AuthValidation.otpVerifyZodSchema), Auth_Controller_1.AuthController.signupverifyOtp);
router.post('/signin', (0, cors_1.default)(), (0, validateRequest_1.default)(Auth_Validation_1.AuthValidation.signUpsignInZodSchema), Auth_Controller_1.AuthController.signinWithPhoneNumber);
router.post('/signinverifyotp', (0, cors_1.default)(), (0, validateRequest_1.default)(Auth_Validation_1.AuthValidation.otpVerifyZodSchema), Auth_Controller_1.AuthController.signinverifyOtp);
router.post('/register', (0, validateRequest_1.default)(Auth_Validation_1.AuthValidation.registerEmail), Auth_Controller_1.AuthController.registerUser);
router.post('/verify-email', Auth_Controller_1.AuthController.verifyEmail);
router.post('/login', (0, validateRequest_1.default)(Auth_Validation_1.AuthValidation.loginEmail), Auth_Controller_1.AuthController.loginEmailUser);
router.post('/forgot-password', (0, validateRequest_1.default)(Auth_Validation_1.AuthValidation.forgotPassword), Auth_Controller_1.AuthController.forgotPassword);
router.post('/reset-password', (0, validateRequest_1.default)(Auth_Validation_1.AuthValidation.resetPassword), Auth_Controller_1.AuthController.resetPassword);
exports.AuthRoutes = router;
