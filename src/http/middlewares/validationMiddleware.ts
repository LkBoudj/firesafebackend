import { ZodError, ZodSchema } from "zod";

import StatusCodes from "http-status-codes";
import { NextFunction, Response, Request } from "express";

function validateData(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, errors: errorMessages, data: null });
      } else {
        const error: any = new Error("Internal Server Error");
        error.status = 404;
        next(error);
      }
    }
  };
}

export default validateData;
