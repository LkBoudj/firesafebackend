import { NextFunction, Response, Request } from "express";
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const error: any = new Error("Authentication failed");
    error.status = 404;
    next(error);
  }
};

export default isAuthenticated;
