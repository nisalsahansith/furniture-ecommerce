import api from "./axios";
import type {
  Payment,
  PayHereCheckoutResponse,
} from "../types/payment";

export const createPayHereCheckout = async (
  orderId: string
): Promise<PayHereCheckoutResponse> => {
  const response = await api.post<PayHereCheckoutResponse>(
    "/payments/payhere/checkout",
    {
      orderId,
    }
  );

  return response.data;
};

export const getOrderPayments = async (
  orderId: string
): Promise<Payment[]> => {
  const response = await api.get<{
    success: boolean;
    data: Payment[];
  }>(`/payments/order/${orderId}`);

  return response.data.data;
};