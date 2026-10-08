import { NextFunction, Request, Response } from "express";
import { UserRole } from "../entities/User";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};