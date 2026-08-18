import {
  Request,
  Response,
  NextFunction
} from "express";

import { Prisma } from "@prisma/client";

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("ERROR:", error);

  // Prisma errors
  if (
    error instanceof
    Prisma.PrismaClientKnownRequestError
  ) {
    return res.status(400).json({
      message: "Database operation failed"
    });
  }

  // Prisma validation errors
  if (
    error instanceof
    Prisma.PrismaClientValidationError
  ) {
    return res.status(400).json({
      message: "Invalid data provided"
    });
  }

  // Other errors
  const statusCode =
    error.statusCode || 500;

  return res.status(statusCode).json({
    message:
      error.message ||
      "Something went wrong. Please try again."
  });
};