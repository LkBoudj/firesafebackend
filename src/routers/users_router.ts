import express, { Router } from "express";
import UserController from "../http/controllers/user_controller";
import { validateData } from "../http/middlewares";
import {
  CreateSchema,
  DeleSchema,
  updateSchema,
} from "../http/validation/user_validation";

const router: Router = express.Router();

router.get("/", UserController.all);
router.post("/", validateData(CreateSchema), UserController.create);
router.delete("/", validateData(DeleSchema), UserController.deleteMany);
router.get("/:id", UserController.show);
router.patch("/:id", validateData(updateSchema), UserController.update);
router.delete("/:id", UserController.delete);

export default router;
