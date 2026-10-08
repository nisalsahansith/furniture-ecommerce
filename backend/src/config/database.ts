import "reflect-metadata";
import "pg";

import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { User } from "../entities/User";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Payment } from "../entities/Payment";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Category,
    Product,
    Order,
    OrderItem,
    Payment,
  ],
});