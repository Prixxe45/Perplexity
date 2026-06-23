import { Router } from "express";
import { registerValidation } from "../validation/auth.validator.js";
import {
  register,
  resendEmailVerification,
  login,
  getMe,
  verifyEmail,
} from "../controller/auth.controller.js";

import { loginValidation } from "../validation/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();
/** 
 * @route Post /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
authRouter.post("/register", registerValidation, register);


/**
 * @route Post /api/auth/resendEmailVerification
 * @desc Resend email verification link to the user
 * @access Public
 * @body { email }
 */
authRouter.post("/resend-email-verification", resendEmailVerification)

/** 
 * @route Post /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */
authRouter.post("/login",loginValidation, login);

/** 
 * @route Get /api/auth/verify-email
 * @desc Verify user's email address
 * @access Private
 */
authRouter.get("/get-me", authUser, getMe);

/** 
 * @route Get /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query {token}
 */
authRouter.get("/verify-email", verifyEmail);

export default authRouter;