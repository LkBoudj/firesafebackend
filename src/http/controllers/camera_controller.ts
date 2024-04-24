import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import CustomError from "../errors/custom_error";
import fs from "fs";
import CameraModel from "../models/camera";
import {
  checkRTSPUrl,
  createDirIfNotExists,
  createStreamVideo,
  findAndKillProcess,
  getPublicPath,
} from "../../utils/helper";
import CameraError from "../errors/camera_errors";
import path from "path";
import axios from "axios";

class CameraController {
  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const cameras = await CameraModel.find();

      res.status(200).json({
        success: true,
        data: cameras,
        errors: [],
      });
    } catch (err) {
      let message = "failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id, dirRecorders }: any = req?.user;
      const camera: any = req.body;
      camera.user = _id;
      const camera_dir = camera.name + "_" + uuidv4();

      const camerasIsWorking = await checkRTSPUrl(camera.rtsp);

      if (!camerasIsWorking) {
        throw new CameraError("rtsp url is not valid");
      }

      await createDirIfNotExists(dirRecorders, camera_dir);

      const c = path.join(dirRecorders, camera_dir, "output.m3u8");

      const { success, streamUrl, pid }: any = await createStreamVideo(
        camera.rtsp,
        c
      );

      if (!success) {
        throw new CameraError("the video stream not working");
      }
      camera.streamUrl = streamUrl;
      camera.pid = pid;
      const newCamera = (await CameraModel.create(camera)).toJSON();

      res.json({
        success: true,
        data: newCamera,
        errors: [],
      });
    } catch (err) {
      console.log("++++++++++++++++++++++>", err);

      let message = "Creating a new camera failed";
      if (err instanceof CameraError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }
  async show(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const record = await CameraModel.findById(id);

      if (!record) throw new CustomError("The Recode is not exists");

      res.status(200).json({
        success: true,
        data: record.toJSON(),
        errors: [],
      });
    } catch (err) {
      console.log(err);

      let message = "failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      //get the id params
      const { id } = req.params;
      //check if user already
      const isExits = await CameraModel.findById(id);

      if (!isExits) throw new CustomError("The user is not exists");

      const isEmailUpdate = await CameraModel.findOne({
        email: req.body.email,
      });

      if (isEmailUpdate && isExits.email != req.body.email) {
        throw new CustomError("Email is already in use");
      }

      const user = await CameraModel.updateOne(req.body);

      res.json({
        success: true,
        data: user,
        errors: [],
      });
    } catch (err) {
      console.log(err);

      let message = "Update user failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      //get the id params
      const { id } = req.params;

      //check if user already
      const isExits: any = await CameraModel.findById(id);

      if (!isExits) throw new CustomError("The record is not exists");
      await findAndKillProcess(isExits.pid);

      const record = await CameraModel.deleteOne(req.body);

      res.json({
        success: true,
        data: record,
        errors: [],
      });
    } catch (err) {
      console.log(err);

      let message = "deleted is failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }

  async deleteMany(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.ids.forEach(async (id: string) => {
        const isExits: any = await CameraModel.findById(id);
        if (isExits) {
          await findAndKillProcess(isExits.pid);
        }
      });
      //get the id params
      const user = await CameraModel.deleteMany({ _id: { $in: req.body.ids } });

      res.json({
        success: true,
        data: user,
        errors: [],
      });
    } catch (err) {
      let message = "delete failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }

  async test(req: Request, res: Response, next: NextFunction) {
    try {
      const getImagePath = await getPublicPath("image.jpg");
      const data = fs.readFileSync(getImagePath, {
        encoding: "base64",
      });

      // const response = await fetch(
      //   "https://api-inference.huggingface.co/models/arnaucas/wildfire-classifier",
      //   {
      //     headers: {
      //       Authorization: "Bearer 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",
      //     },
      //     method: "POST",
      //     body: data,
      //   }
      // );
      // const result = await response.json();

      axios({
        method: "POST",
        url: "https://detect.roboflow.com/test-e0sai/1",
        params: {
          api_key: "tHnUsRCtRByxzCrb4WRN",
        },
        data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then(function (response) {
          res.json({
            success: true,
            data: response.data,
            errors: [],
          });
        })
        .catch(function (error) {
          console.log(error.message);
          res.json({
            success: false,
            data: null,
            errors: [error.message],
          });
        });
    } catch (err) {
      console.log(err);

      let message = "delete failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }
}

export default new CameraController();
