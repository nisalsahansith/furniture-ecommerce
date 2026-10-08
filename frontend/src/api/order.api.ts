import api from "./axios";
import type {
  CreateOrderRequest,
  Order,
  OrderListResponse,
} from "../types/order";

export const createOrder = async (
  data: CreateOrderRequest
): Promise<Order> => {
  const response = await api.post<{ success: boolean; data: Order }>(
    "/orders",
    data
  );

  return response.data.data;
};

export const getMyOrders = async (): Promise<OrderListResponse> => {
  const response = await api.get<OrderListResponse>("/orders");

  return response.data;
};

export const getOrderById = async (
  id: string
): Promise<Order> => {
  const response = await api.get<{ success: boolean; data: Order }>(
    `/orders/${id}`
  );

  return response.data.data;
};

export const getOrders = async (
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<OrderListResponse> => {
  const response = await api.get<OrderListResponse>("/orders", {
    params,
  });

  return response.data;
};