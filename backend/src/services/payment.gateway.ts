import { Order } from "../entities/Order";

export interface PayHereCheckoutData {
  order: Order;
}

export interface PayHereCheckoutResponse {
  paymentUrl: string;
  fields: Record<string, string>;
}

export interface PayHereNotification {
  merchant_id: string;
  order_id: string;
  payment_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
  custom_1?: string;
  custom_2?: string;
}

export interface IPaymentGateway {
  createCheckout(
    data: PayHereCheckoutData
  ): Promise<PayHereCheckoutResponse>;

  verifyNotification(
    notification: PayHereNotification
  ): boolean;
}