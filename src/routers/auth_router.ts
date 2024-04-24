import express, { Router } from "express";
import passport from "passport";
import { validateData } from "../http/middlewares";
import {
  LoginSchema,
  RegisterSchema,
} from "../http/validation/auth_validation";
import AuthController from "../http/controllers/auth_controller";
const router: Router = express.Router();

router.post(
  "/login",
  validateData(LoginSchema),
  passport.authenticate("local"),
  AuthController.login
);

router.post("/register", validateData(RegisterSchema), AuthController.register);

export default router;
