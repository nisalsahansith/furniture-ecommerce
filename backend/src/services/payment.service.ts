import { Payment } from "../entities/Payment";
import { PayHereNotification } from "./payment.gateway";

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  method: string;
  transactionId?: string | null;
  paymentReference?: string | null;
}

export interface UpdatePaymentInput {
  transactionId?: string | null;
  status?: string;
  paymentReference?: string | null;
}

export interface IPaymentService {
  createPayment(data: CreatePaymentInput): Promise<Payment>;

  getPaymentById(id: string): Promise<Payment>;

  getPaymentsByOrderId(orderId: string): Promise<Payment[]>;

  updatePayment(
    id: string,
    data: UpdatePaymentInput
  ): Promise<Payment>;

  handlePaymentSuccess(
    transactionId: string,
    paymentReference?: string
  ): Promise<Payment>;

  handlePaymentFailure(
    transactionId: string,
    paymentReference?: string
  ): Promise<Payment>;

  createPayHereCheckout(
    orderId: string
  ): Promise<{
    paymentUrl: string;
    fields: Record<string, string>;
  }>;

  handlePayHereNotification(notification: PayHereNotification): Promise<void>;
}