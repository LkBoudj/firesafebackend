import { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import CustomError from "../errors/custom_error";
class AuthController {
  login(req: Request, res: Response, next: NextFunction) {
    res.json({
      success: true,
      user: req.body,
    });
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      //check if user already

      const isExits = await userModel.findOne({ email: req.body.email });
      if (isExits) {
        throw new CustomError("The email is really invalid");
      }
      const { password, __v, ...newUser } = (
        await userModel.create(req.body)
      ).toJSON();

      res.json({
        success: true,
        user: newUser,
      });
    } catch (err) {
      let message = "Creating a new user failed";
      if (err instanceof CustomError) message = err.message;
      const error: any = new Error(message);
      error.status = 404;
      next(error);
    }
  }
}

export default new AuthController();
