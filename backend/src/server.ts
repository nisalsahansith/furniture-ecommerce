import "reflect-metadata";
import "dotenv/config";

import cors from "cors";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";

import { AppDataSource } from "./config/database";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

let databaseInitialized = false;
let databaseInitializationPromise: Promise<void> | null = null;

const initializeDatabase = async (): Promise<void> => {
  if (databaseInitialized) {
    return;
  }

  if (!databaseInitializationPromise) {
    databaseInitializationPromise = AppDataSource.initialize()
      .then(() => {
        databaseInitialized = true;
        console.log("Database connected successfully");
      })
      .catch((error) => {
        databaseInitializationPromise = null;
        console.error("Database connection failed:", error);
        throw error;
      });
  }

  await databaseInitializationPromise;
};

app.use(async (_req, _res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Furniture E-Commerce API is running",
  });
});

export default app;