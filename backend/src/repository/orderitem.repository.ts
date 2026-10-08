import { EntityManager } from "typeorm";
import { OrderItem } from "../entities/OrderItem";

export interface IOrderItemRepository {
  create(
    data: Partial<OrderItem>,
    manager?: EntityManager
  ): OrderItem;

  save(
    orderItems: OrderItem[],
    manager?: EntityManager
  ): Promise<OrderItem[]>;
}