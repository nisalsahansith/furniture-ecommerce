import { EntityManager } from "typeorm";
import { Payment } from "../entities/Payment";

export interface CreatePaymentData {
  orderId: string;
  transactionId?: string | null;
  amount: number;
  method: string;
  status: string;
  paymentReference?: string | null;
}

export interface UpdatePaymentData {
  transactionId?: string | null;
  status?: string;
  paymentReference?: string | null;
}

export interface IPaymentRepository {
  getById(id: string): Promise<Payment | null>;
  getByOrderId(orderId: string,manager?: EntityManager): Promise<Payment[]>;
  getByTransactionId(transactionId: string,manager?: EntityManager): Promise<Payment | null>;
  create(data: CreatePaymentData, manager?: EntityManager): Promise<Payment>;
  update(id: string, data: UpdatePaymentData, manager?: EntityManager): Promise<Payment | null>;
  save(payment: Payment, manager?: EntityManager): Promise<Payment>;
}