import {
  AppDataSource,
} from "../../config/database";
import {
  EntityManager,
} from "typeorm";
import {
  OrderItem,
} from "../../entities/OrderItem";
import {
  IOrderItemRepository,
} from "../orderitem.repository";

export class OrderItemRepositoryImpl
  implements IOrderItemRepository
{
  private readonly repository =
    AppDataSource.getRepository(OrderItem);

  create(
    data: Partial<OrderItem>,
    manager: EntityManager = AppDataSource.manager
  ): OrderItem {
    return manager
      .getRepository(OrderItem)
      .create(data);
  }

  async save(
    orderItems: OrderItem[],
    manager: EntityManager = AppDataSource.manager
  ): Promise<OrderItem[]> {
    return await manager
      .getRepository(OrderItem)
      .save(orderItems);
  }
}