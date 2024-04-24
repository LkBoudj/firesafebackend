import { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import CustomError from "../errors/custom_error";
import { createDirIfNotExists, getPublicPath } from "../../utils/helper";

class CameraController {
  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userModel.find();

      res.status(200).json({
        success: true,
        data: users,
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
      //check if user already

      let isExits = await userModel.findOne({ email: req.body.email });
      if (isExits) {
        throw new CustomError("The email is really invalid");
      }
      // const { password, __v, ...newUser } = (
      //   await userModel.create(req.body)
      // ).toJSON();

      const newUser = await userModel.create(req.body);
      // create recorder user directory
      const user_recorders_directory = `recorders\\recorders_${newUser.id}`;
      await createDirIfNotExists(user_recorders_directory);
      newUser.dirRecorders = user_recorders_directory;
      newUser.save();
      const { password, __v, ...userWithoutPassword } = newUser.toJSON();
      res.json({
        success: true,
        user: userWithoutPassword,
        errors: [],
      });
    } catch (err) {
      console.log(err);

      let message = "Creating a new user failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }
  async show(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const user = await userModel.findById(id);

      if (!user) throw new CustomError("The user is not exists");

      const { password, __v, ...resetUser } = user.toJSON();
      res.status(200).json({
        success: true,
        data: resetUser,
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
      const isExits = await userModel.findById(id);

      if (!isExits) throw new CustomError("The user is not exists");

      const isEmailUpdate = await userModel.findOne({ email: req.body.email });

      if (isEmailUpdate && isExits.email != req.body.email) {
        throw new CustomError("Email is already in use");
      }

      const user = await userModel.updateOne(req.body);

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
      const isExits = await userModel.findById(id);

      if (!isExits) throw new CustomError("The user is not exists");

      const user = await userModel.deleteOne(req.body);

      res.json({
        success: true,
        data: user,
        errors: [],
      });
    } catch (err) {
      let message = "delete user failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }

  async deleteMany(req: Request, res: Response, next: NextFunction) {
    try {
      //get the id params
      const user = await userModel.deleteMany({ _id: { $in: req.body.ids } });

      res.json({
        success: true,
        data: user,
        errors: [],
      });
    } catch (err) {
      let message = "delete user failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }
}

export default new CameraController();
