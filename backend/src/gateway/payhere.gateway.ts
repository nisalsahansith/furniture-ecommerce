import crypto from "crypto";
import {
  IPaymentGateway,
  PayHereCheckoutData,
  PayHereCheckoutResponse,
  PayHereNotification,
} from "../services/payment.gateway";

export class PayHereGateway implements IPaymentGateway {
  private readonly merchantId: string;
  private readonly merchantSecret: string;
  private readonly paymentUrl: string;

  constructor() {
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const paymentUrl =
      process.env.PAYHERE_SANDBOX_URL ??
      "https://sandbox.payhere.lk/pay/checkout";

    if (!merchantId || !merchantSecret) {
      throw new Error("PayHere credentials are not configured");
    }

    this.merchantId = merchantId;
    this.merchantSecret = merchantSecret;
    this.paymentUrl = paymentUrl;
  }

  private md5(value: string): string {
    return crypto
      .createHash("md5")
      .update(value)
      .digest("hex")
      .toUpperCase();
  }

  private generateHash(
    orderId: string,
    amount: number,
    currency: string
  ): string {
    const formattedAmount = amount.toFixed(2);
    const hashedSecret = this.md5(this.merchantSecret);

    return this.md5(
      this.merchantId +
        orderId +
        formattedAmount +
        currency +
        hashedSecret
    );
  }

  async createCheckout(
    data: PayHereCheckoutData
  ): Promise<PayHereCheckoutResponse> {
    const { order } = data;

    const amount = Number(order.totalAmount);
    const currency = "LKR";

    const nameParts = order.customerName.trim().split(" ");

    const firstName = nameParts.shift() || order.customerName;
    const lastName = nameParts.join(" ") || firstName;

    const hash = this.generateHash(
      order.orderNumber,
      amount,
      currency
    );

    const fields: Record<string, string> = {
      merchant_id: this.merchantId,
      return_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      notify_url: `${process.env.BACKEND_URL}/api/payments/payhere/notify`,

      first_name: firstName,
      last_name: lastName,
      email: order.customerEmail,
      phone: order.customerPhone,

      address: order.shippingAddress,
      city: order.city,
      country: "Sri Lanka",

      order_id: order.orderNumber,
      items: `Furniture Order ${order.orderNumber}`,

      currency,
      amount: amount.toFixed(2),
      hash,
    };

    return {
      paymentUrl: this.paymentUrl,
      fields,
    };
  }

  verifyNotification(
    notification: PayHereNotification
  ): boolean {
    const localHash = this.md5(
      this.merchantId +
        notification.order_id +
        notification.payhere_amount +
        notification.payhere_currency +
        notification.status_code +
        this.md5(this.merchantSecret)
    );

    return localHash === notification.md5sig.toUpperCase();
  }
}