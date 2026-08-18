import { Router } from "express";

import {
  register,
  login
} from "../controllers/authController";

import {
  registerSchema,
  loginSchema
} from "../validators/authValidator.js";

import {
  validate
} from "../middleware/validateMiddleware.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

export default router;