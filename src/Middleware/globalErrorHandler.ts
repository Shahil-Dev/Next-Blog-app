import { NextFunction, Request, Response } from "express";
import { error } from "node:console";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(500);
  res.json(
    {
        message:"Error from globalErrorHandler",
        error:err
    }
  );
}

export default globalErrorHandler;
