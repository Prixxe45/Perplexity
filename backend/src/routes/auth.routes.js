import { Router } from "express";
import { registerValidation } from "../validation/auth.validator.js";
import { register } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, register);

export default authRouter;