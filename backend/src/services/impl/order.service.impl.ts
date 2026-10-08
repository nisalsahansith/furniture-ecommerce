import { EntityManager } from "typeorm/entity-manager/EntityManager.js";
import {
  AppDataSource,
} from "../../config/database";
import {
  Order,
  OrderStatus,
  PaymentStatus,
} from "../../entities/Order";
import {
  User,
} from "../../entities/User";
import { OrderRepositoryImpl } from "../../repository/impl/order.repository.impl";
import { OrderItemRepositoryImpl } from "../../repository/impl/orderitem.repository.impl";
import { ProductRepositoryImpl } from "../../repository/impl/product.repository.impl";
import { IOrderRepository } from "../../repository/order.repository";
import { IOrderItemRepository } from "../../repository/orderitem.repository";
import { IProductRepository } from "../../repository/product.repository";
import { CreateOrderInput, IOrderService } from "../order.service";


export class OrderServiceImpl
  implements IOrderService
{
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderItemRepository: IOrderItemRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async createOrder(
    userId: string | null,
    data: CreateOrderInput
  ): Promise<Order> {
    if (!data.items || data.items.length === 0) {
      throw new Error(
        "Order must contain at least one item"
      );
    }

    if (
      data.paymentMethod !== null &&
      data.paymentMethod !== undefined
    ) {
      if (
        !Object.values(
          ["PAYHERE", "WHATSAPP"]
        ).includes(data.paymentMethod)
      ) {
        throw new Error(
          "Invalid payment method"
        );
      }
    }

    return await AppDataSource.transaction(
      async (manager) => {
        const transactionOrderRepository =
          new OrderRepositoryImpl();

        const transactionOrderItemRepository =
          new OrderItemRepositoryImpl();

        const transactionProductRepository =
          new ProductRepositoryImpl();

        let user: User | null = null;

        if (userId) {
          user = await manager
            .getRepository(User)
            .findOne({
              where: {
                id: userId,
              },
            });

          if (!user) {
            throw new Error(
              "User not found"
            );
          }
        }

        let totalAmount = 0;

        const orderItems = [];

        for (const item of data.items) {
          if (!item.productId) {
            throw new Error(
              "Product ID is required"
            );
          }

          if (
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0
          ) {
            throw new Error(
              `Invalid quantity for product ${item.productId}`
            );
          }

          const product =
            await transactionProductRepository
              .getByIdForOrder(
                item.productId,
                manager
              );

          if (!product) {
            throw new Error(
              `Product not found: ${item.productId}`
            );
          }

          if (
            product.stockQuantity <
            item.quantity
          ) {
            throw new Error(
              `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`
            );
          }

          const unitPrice =
            Number(product.price);

          const subtotal =
            unitPrice * item.quantity;

          totalAmount += subtotal;

          product.stockQuantity -=
            item.quantity;

          await transactionProductRepository.save(
            product,
            manager
          );

          const orderItem =
            transactionOrderItemRepository.create(
              {
                product,
                productName: product.name,
                unitPrice,
                quantity: item.quantity,
                subtotal,
              },
              manager
            );

          orderItems.push(orderItem);
        }

        const orderNumber =
        await this.generateOrderNumber(
            transactionOrderRepository,
            manager
        );

        const order =
          await transactionOrderRepository.create(
            {
              orderNumber,
              user,
              customerName:
                data.customerName.trim(),
              customerEmail:
                data.customerEmail
                  .toLowerCase()
                  .trim(),
              customerPhone:
                data.customerPhone.trim(),
              shippingAddress:
                data.shippingAddress.trim(),
              city: data.city.trim(),
              totalAmount,
              status: OrderStatus.PENDING,
              paymentStatus:
                PaymentStatus.PENDING,
              paymentMethod:
                data.paymentMethod ?? null,
            },
            manager
          );

        for (const orderItem of orderItems) {
          orderItem.order = order;
        }

        await transactionOrderItemRepository.save(
          orderItems,
          manager
        );

        const savedOrder =
          await manager
            .getRepository(Order)
            .findOne({
              where: {
                id: order.id,
              },
              relations: {
                user: true,
                items: {
                  product: true,
                },
                payments: true,
              },
            });

        if (!savedOrder) {
          throw new Error(
            "Failed to retrieve created order"
          );
        }

        return savedOrder;
      }
    );
  }

  private async generateOrderNumber(
    orderRepository: IOrderRepository,
    manager: EntityManager
  ): Promise<string> {
    let orderNumber: string;

  do {
        const timestamp = Date.now()
        .toString()
        .slice(-8);

        const random = Math.floor(
        1000 + Math.random() * 9000
        );

        orderNumber = `ORD-${timestamp}-${random}`;

        const existingOrder =
        await orderRepository.getByOrderNumber(
            orderNumber,
            manager
        );

        if (!existingOrder) {
        return orderNumber;
        }
    } while (true);
}

  async getCustomerOrders(
    userId: string
  ): Promise<Order[]> {
    return await this.orderRepository
      .getCustomerOrders(userId);
  }

  async getCustomerOrderById(
    userId: string,
    orderId: string
  ): Promise<Order> {
    const order =
      await this.orderRepository
        .getCustomerOrderById(
          userId,
          orderId
        );

    if (!order) {
      throw new Error(
        "Order not found"
      );
    }

    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.getAll();
  }

  async getOrderById(
    orderId: string
  ): Promise<Order> {
    const order =
      await this.orderRepository.getById(
        orderId
      );

    if (!order) {
      throw new Error(
        "Order not found"
      );
    }

    return order;
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<Order> {
    if (
      !Object.values(OrderStatus).includes(
        status
      )
    ) {
      throw new Error(
        "Invalid order status"
      );
    }

    return await AppDataSource.transaction(
      async (manager) => {
        const transactionOrderRepository =
          new OrderRepositoryImpl();

        const transactionProductRepository =
          new ProductRepositoryImpl();

        const order =
          await manager
            .getRepository(Order)
            .findOne({
              where: {
                id: orderId,
              },
              relations: {
                items: {
                  product: true,
                },
              },
            });

        if (!order) {
          throw new Error(
            "Order not found"
          );
        }

        const allowedTransitions: Record<
          OrderStatus,
          OrderStatus[]
        > = {
          [OrderStatus.PENDING]: [
            OrderStatus.CONFIRMED,
            OrderStatus.CANCELLED,
          ],

          [OrderStatus.CONFIRMED]: [
            OrderStatus.PROCESSING,
            OrderStatus.CANCELLED,
          ],

          [OrderStatus.PROCESSING]: [
            OrderStatus.SHIPPED,
            OrderStatus.CANCELLED,
          ],

          [OrderStatus.SHIPPED]: [
            OrderStatus.DELIVERED,
          ],

          [OrderStatus.DELIVERED]: [],

          [OrderStatus.CANCELLED]: [],
        };

        if (
          !allowedTransitions[
            order.status
          ].includes(status)
        ) {
          throw new Error(
            `Cannot change order status from ${order.status} to ${status}`
          );
        }

        if (
          status ===
          OrderStatus.CANCELLED
        ) {
          for (const item of order.items) {
            if (!item.product) {
              continue;
            }

            item.product.stockQuantity +=
              item.quantity;

            await transactionProductRepository.save(
              item.product,
              manager
            );
          }
        }

        order.status = status;

        return await transactionOrderRepository.save(
          order,
          manager
        );
      }
    );
  }
}