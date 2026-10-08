import { AppDataSource } from "../../config/database";
import {
  IPaymentRepository,
  CreatePaymentData,
} from "../../repository/payment.repository";
import { Payment } from "../../entities/Payment";
import { Order, OrderStatus, PaymentStatus } from "../../entities/Order";
import {
  CreatePaymentInput,
  IPaymentService,
  UpdatePaymentInput,
} from "../payment.service";
import { IPaymentGateway, PayHereNotification } from "../payment.gateway";
import { IOrderRepository } from "../../repository/order.repository";

export class PaymentServiceImpl implements IPaymentService {
    constructor(
      private readonly paymentRepository: IPaymentRepository,
      private readonly orderRepository: IOrderRepository,
      private readonly paymentGateway: IPaymentGateway
    ) {}

  async createPayment(data: CreatePaymentInput): Promise<Payment> {
    if (data.amount <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    if (!data.orderId) {
      throw new Error("Order ID is required");
    }

    const paymentData: CreatePaymentData = {
      orderId: data.orderId,
      amount: data.amount,
      method: data.method,
      transactionId: data.transactionId ?? null,
      status: "PENDING",
      paymentReference: data.paymentReference ?? null,
    };

    return await this.paymentRepository.create(paymentData);
  }

  async getPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.getById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  async getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
    return await this.paymentRepository.getByOrderId(orderId);
  }

  async updatePayment(
    id: string,
    data: UpdatePaymentInput
  ): Promise<Payment> {
    const payment = await this.paymentRepository.update(id, data);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }

  async handlePaymentSuccess(
  transactionId: string,
  paymentReference?: string
): Promise<Payment> {
  return await AppDataSource.transaction(async (manager) => {
    const payment = await this.paymentRepository.getByTransactionId(
      transactionId,
      manager
    );

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status === "PAID") {
      return payment;
    }

    const order = await this.orderRepository.getById(
      payment.order.id,
      manager
    );

    if (!order) {
      throw new Error("Order not found");
    }

    payment.status = "PAID";
    payment.transactionId = transactionId;
    payment.paymentReference = paymentReference ?? transactionId;

    const updatedPayment = await this.paymentRepository.save(
      payment,
      manager
    );

    order.paymentStatus = PaymentStatus.PAID;

    if (order.status === OrderStatus.PENDING) {
      order.status = OrderStatus.CONFIRMED;
    }

    await this.orderRepository.save(order, manager);

    return updatedPayment;
  });
}

  async handlePaymentFailure(
  transactionId: string,
  paymentReference?: string
): Promise<Payment> {
  return await AppDataSource.transaction(async (manager) => {
    const payment = await this.paymentRepository.getByTransactionId(
      transactionId,
      manager
    );

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status === "FAILED") {
      return payment;
    }

    const order = await this.orderRepository.getById(
      payment.order.id,
      manager
    );

    if (!order) {
      throw new Error("Order not found");
    }

    payment.status = "FAILED";
    payment.transactionId = transactionId;
    payment.paymentReference = paymentReference ?? transactionId;

    const updatedPayment = await this.paymentRepository.save(
      payment,
      manager
    );

    order.paymentStatus = PaymentStatus.FAILED;

    await this.orderRepository.save(order, manager);

    return updatedPayment;
  });
  }
  
    async createPayHereCheckout(
  orderId: string
): Promise<{ paymentUrl: string; fields: Record<string, string> }> {
  const order = await this.orderRepository.getById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    throw new Error("Order has already been paid");
  }

  if (order.status === OrderStatus.CANCELLED) {
    throw new Error("Cancelled orders cannot be paid");
  }

  const existingPayments = await this.paymentRepository.getByOrderId(
    order.id
  );

  const existingPendingPayment = existingPayments.find(
    (payment) =>
      payment.method === "PAYHERE" &&
      payment.status === "PENDING"
  );

  if (!existingPendingPayment) {
    await this.paymentRepository.create({
      orderId: order.id,
      amount: Number(order.totalAmount),
      method: "PAYHERE",
      status: "PENDING",
    });
  }

  return await this.paymentGateway.createCheckout({
    order,
  });
}

  async handlePayHereNotification(
    notification: PayHereNotification
  ): Promise<void> {
    const isValid = this.paymentGateway.verifyNotification(notification);

    if (!isValid) {
      throw new Error("Invalid PayHere notification");
    }

    const orderNumber = notification.order_id;
    const transactionId = notification.payment_id;
    const statusCode = notification.status_code;

    if (!orderNumber || !transactionId || !statusCode) {
      throw new Error("Invalid PayHere notification data");
    }

    const order = await this.orderRepository.getByOrderNumber(orderNumber);

    if (!order) {
      throw new Error("Order not found");
    }

    const notificationAmount = Number(notification.payhere_amount);
    const orderAmount = Number(order.totalAmount);

    if (notificationAmount !== orderAmount) {
      throw new Error("Payment amount does not match order amount");
    }

    if (notification.payhere_currency !== "LKR") {
      throw new Error("Unsupported payment currency");
    }

    if (statusCode === "2") {
      await this.handleSuccessfulPayHerePayment(
        order.id,
        transactionId
      );
      return;
    }

    if (["-1", "-2", "-3"].includes(statusCode)) {
      await this.handleFailedPayHerePayment(
        order.id,
        transactionId
      );
      return;
    }

    console.log(
      `PayHere payment ${transactionId} received with status ${statusCode}`
    );
  }

  private async handleSuccessfulPayHerePayment(
  orderId: string,
  transactionId: string
): Promise<void> {
  await AppDataSource.transaction(async (manager) => {
    const order = await this.orderRepository.getById(
      orderId,
      manager
    );

    if (!order) {
      throw new Error("Order not found");
    }

    const payments = await this.paymentRepository.getByOrderId(
      orderId,
      manager
    );

    let payment = payments.find(
      (item) => item.method === "PAYHERE"
    );

    if (!payment) {
      payment = await this.paymentRepository.create(
        {
          orderId,
          amount: Number(order.totalAmount),
          method: "PAYHERE",
          status: "PENDING",
        },
        manager
      );
    }

    if (payment.status === "PAID") {
      return;
    }

    payment.transactionId = transactionId;
    payment.paymentReference = transactionId;
    payment.status = "PAID";

    await this.paymentRepository.save(payment, manager);

    order.paymentStatus = PaymentStatus.PAID;

    if (order.status === OrderStatus.PENDING) {
      order.status = OrderStatus.CONFIRMED;
    }

    await this.orderRepository.save(order, manager);
  });
  }
  private async handleFailedPayHerePayment(
  orderId: string,
  transactionId: string
): Promise<void> {
  await AppDataSource.transaction(async (manager) => {
    const order = await this.orderRepository.getById(
      orderId,
      manager
    );

    if (!order) {
      throw new Error("Order not found");
    }

    const payments = await this.paymentRepository.getByOrderId(
      orderId,
      manager
    );

    let payment = payments.find(
      (item) => item.method === "PAYHERE"
    );

    if (!payment) {
      payment = await this.paymentRepository.create(
        {
          orderId,
          amount: Number(order.totalAmount),
          method: "PAYHERE",
          status: "PENDING",
        },
        manager
      );
    }

    if (payment.status === "PAID") {
      return;
    }

    payment.transactionId = transactionId;
    payment.paymentReference = transactionId;
    payment.status = "FAILED";

    await this.paymentRepository.save(payment, manager);

    order.paymentStatus = PaymentStatus.FAILED;

    await this.orderRepository.save(order, manager);
  });
  }
  
}