import express, { Router } from "express";
import CameraController from "../http/controllers/camera_controller";
import { isAuthenticated, validateData } from "../http/middlewares";
import {
  CreateSchema,
  DeleSchema,
  updateSchema,
} from "../http/validation/camera_validation";

const router: Router = express.Router();
router.use(isAuthenticated);
router.get("/test", CameraController.test);
router.get("/", CameraController.all);
router.post("/", validateData(CreateSchema), CameraController.create);
router.delete("/", validateData(DeleSchema), CameraController.deleteMany);
router.get("/:id", CameraController.show);
router.patch("/:id", validateData(updateSchema), CameraController.update);
router.delete("/:id", CameraController.delete);

export default router;
