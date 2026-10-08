import {
  Order,
  OrderStatus,
  PaymentMethod,
} from "../entities/Order";

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  paymentMethod?: PaymentMethod | null;
  items: CreateOrderItemInput[];
}

export interface IOrderService {
  createOrder(
    userId: string | null,
    data: CreateOrderInput
  ): Promise<Order>;

  getCustomerOrders(
    userId: string
  ): Promise<Order[]>;

  getCustomerOrderById(
    userId: string,
    orderId: string
  ): Promise<Order>;

  getAllOrders(): Promise<Order[]>;

  getOrderById(orderId: string): Promise<Order>;

  updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<Order>;
}