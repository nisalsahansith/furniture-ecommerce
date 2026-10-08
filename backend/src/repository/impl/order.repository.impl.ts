import {
  AppDataSource,
} from "../../config/database";
import {
  EntityManager,
} from "typeorm";
import {
  Order,
} from "../../entities/Order";
import {
  CreateOrderData,
  IOrderRepository,
} from "../order.repository";

export class OrderRepositoryImpl
  implements IOrderRepository
{
  private readonly repository =
    AppDataSource.getRepository(Order);

  async getCustomerOrders(
    userId: string
  ): Promise<Order[]> {
    return await this.repository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        items: {
          product: true,
        },
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getCustomerOrderById(
    userId: string,
    orderId: string
  ): Promise<Order | null> {
    return await this.repository.findOne({
      where: {
        id: orderId,
        user: {
          id: userId,
        },
      },
      relations: {
        items: {
          product: true,
        },
        payments: true,
      },
    });
  }

  async getAll(): Promise<Order[]> {
    return await this.repository.find({
      relations: {
        user: true,
        items: {
          product: true,
        },
        payments: true,
      },
      order: {
        createdAt: "DESC",
      },
    });
  }

  async getById(
  orderId: string,
  manager: EntityManager = AppDataSource.manager
): Promise<Order | null> {
  return await manager.getRepository(Order).findOne({
    where: { id: orderId },
    relations: {
      user: true,
      items: { product: true },
      payments: true,
    },
  });
}

async getByOrderNumber(
    orderNumber: string,
    manager: EntityManager = AppDataSource.manager
): Promise<Order | null> {
return await manager
    .getRepository(Order)
    .findOne({
    where: {
        orderNumber,
    },
    });
}

  async create(
    data: CreateOrderData,
    manager: EntityManager = AppDataSource.manager
  ): Promise<Order> {
    const order = manager
      .getRepository(Order)
      .create(data);

    return await manager
      .getRepository(Order)
      .save(order);
  }

  async save(
    order: Order,
    manager: EntityManager = AppDataSource.manager
  ): Promise<Order> {
    return await manager
      .getRepository(Order)
      .save(order);
  }
}