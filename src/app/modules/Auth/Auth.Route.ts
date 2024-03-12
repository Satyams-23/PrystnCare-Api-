import express from 'express';
import { AuthController } from './Auth.Controller';
import validateRequest from '../../../middleware/validateRequest';
import { AuthValidation } from './Auth.Validation';

import cors from 'cors';
import { Auth } from './Auth.Model';

const router = express.Router();

router.post('/logout', AuthController.logoutUser);

router.post(
  '/signup',
  cors(),
  validateRequest(AuthValidation.signUpsignInZodSchema),
  AuthController.signupWithPhoneNumber,
);

router.post(
  '/signupverifyotp',
  cors(),
  validateRequest(AuthValidation.otpVerifyZodSchema),
  AuthController.signupverifyOtp,
);

router.post(
  '/signin',
  cors(),
  validateRequest(AuthValidation.signUpsignInZodSchema),
  AuthController.signinWithPhoneNumber,
);

router.post(
  '/signinverifyotp',
  cors(),
  validateRequest(AuthValidation.otpVerifyZodSchema),
  AuthController.signinverifyOtp,
);

export const AuthRoutes = router;
