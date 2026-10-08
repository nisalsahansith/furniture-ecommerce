import { AppDataSource } from "../../config/database";
import { EntityManager } from "typeorm";
import { Payment } from "../../entities/Payment";
import {
  CreatePaymentData,
  IPaymentRepository,
  UpdatePaymentData,
} from "../payment.repository";

export class PaymentRepositoryImpl implements IPaymentRepository {
  private readonly repository = AppDataSource.getRepository(Payment);

  async getById(id: string): Promise<Payment | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        order: true,
      },
    });
  }

  async getByOrderId(
  orderId: string,
  manager: EntityManager = AppDataSource.manager
): Promise<Payment[]> {
  return await manager.getRepository(Payment).find({
    where: {
      order: {
        id: orderId,
      },
    },
    relations: {
      order: true,
    },
    order: {
      createdAt: "DESC",
    },
  });
}

  async getByTransactionId(
  transactionId: string,
  manager: EntityManager = AppDataSource.manager
): Promise<Payment | null> {
  return await manager.getRepository(Payment).findOne({
    where: {
      transactionId,
    },
    relations: {
      order: true,
    },
  });
}

  async create(
    data: CreatePaymentData,
    manager: EntityManager = AppDataSource.manager
  ): Promise<Payment> {
    const paymentRepository = manager.getRepository(Payment);

    const payment = paymentRepository.create({
      order: {
        id: data.orderId,
      },
      transactionId: data.transactionId ?? null,
      amount: data.amount,
      method: data.method,
      status: data.status,
      paymentReference: data.paymentReference ?? null,
    });

    return await paymentRepository.save(payment);
  }

  async update(
    id: string,
    data: UpdatePaymentData,
    manager: EntityManager = AppDataSource.manager
  ): Promise<Payment | null> {
    const paymentRepository = manager.getRepository(Payment);

    const payment = await paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      return null;
    }

    Object.assign(payment, data);

    return await paymentRepository.save(payment);
  }

  async save(
    payment: Payment,
    manager: EntityManager = AppDataSource.manager
  ): Promise<Payment> {
    return await manager.getRepository(Payment).save(payment);
  }
}