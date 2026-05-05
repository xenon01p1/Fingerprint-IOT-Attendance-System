import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}

export const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode ?? 500;
    res.status(statusCode).json({ status: false, message: err.message ?? "System error" });
}