import { NextFunction, Request, Response } from "express";
import { PrismaClientValidationError } from "@prisma/client/runtime/library.js"; 

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal server Error";
  let errorDetails = err;

  if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provided incorrect fields";
  }

  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default globalErrorHandler;


