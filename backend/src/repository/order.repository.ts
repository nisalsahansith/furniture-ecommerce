import { EntityManager } from "typeorm";
import { Order, OrderStatus } from "../entities/Order";

export interface CreateOrderData {
  orderNumber: string;
  user: Order["user"];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: Order["paymentStatus"];
  paymentMethod: Order["paymentMethod"];
}

export interface IOrderRepository {
  getCustomerOrders(userId: string): Promise<Order[]>;
  getCustomerOrderById(userId: string, orderId: string): Promise<Order | null>;
  getAll(): Promise<Order[]>;
  getById(orderId: string, manager?: EntityManager): Promise<Order | null>;
  getByOrderNumber(
    orderNumber: string,
    manager?: EntityManager
  ): Promise<Order | null>;
  create(data: CreateOrderData, manager?: EntityManager): Promise<Order>;
  save(order: Order, manager?: EntityManager): Promise<Order>;
}