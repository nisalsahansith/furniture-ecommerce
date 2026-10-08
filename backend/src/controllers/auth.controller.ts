import { Request, Response } from "express";
import authService from "../services/auth.service";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email and password are required",
        });
      }

      const result = await authService.register({
        name,
        email,
        password,
      });

      res.cookie(
        "refreshToken",
        result.refreshToken,
        refreshCookieOptions
      );

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      console.error("Register error:", error);

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Registration failed",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await authService.login({
        email,
        password,
      });

      res.cookie(
        "refreshToken",
        result.refreshToken,
        refreshCookieOptions
      );

      return res.json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      console.error("Login error:", error);

      return res.status(401).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Login failed",
      });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token not found",
        });
      }

      const result =
        await authService.refreshAccessToken(refreshToken);

      return res.json({
        success: true,
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      });
    } catch (error) {
      res.clearCookie("refreshToken", refreshCookieOptions);

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken", refreshCookieOptions);

    return res.json({
      success: true,
      message: "Logout successful",
    });
  }

  async me(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Get current user error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  }
}

export default new AuthController();