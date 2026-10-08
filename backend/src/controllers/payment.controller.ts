import { Request, Response } from "express";
import { paymentService } from "../services/service.container";

export class PaymentController {
  static async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const {
        orderId,
        amount,
        method,
        transactionId,
        paymentReference,
      } = req.body;

      if (!orderId || amount === undefined || !method) {
        res.status(400).json({
          success: false,
          message: "Order ID, amount and payment method are required",
        });
        return;
      }

      const payment = await paymentService.createPayment({
        orderId,
        amount: Number(amount),
        method,
        transactionId: transactionId ?? null,
        paymentReference: paymentReference ?? null,
      });

      res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error("Create payment error:", error);

      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create payment",
      });
    }
  }

  static async getPaymentById(
    req: Request<{id: string}>,
    res: Response
  ): Promise<void> {
    try {
      const payment = await paymentService.getPaymentById(req.params.id);

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get payment";

      res.status(message === "Payment not found" ? 404 : 400).json({
        success: false,
        message,
      });
    }
  }

  static async getPaymentsByOrderId(
    req: Request<{orderId: string}>,
    res: Response
  ): Promise<void> {
    try {
      const payments = await paymentService.getPaymentsByOrderId(
        req.params.orderId
      );

      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      console.error("Get order payments error:", error);

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get order payments",
      });
    }
  }

  static async updatePayment(
    req: Request<{id: string}>,
    res: Response
  ): Promise<void> {
    try {
      const payment = await paymentService.updatePayment(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update payment";

      res.status(message === "Payment not found" ? 404 : 400).json({
        success: false,
        message,
      });
    }
  }

  static async handlePaymentSuccess(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { transactionId, paymentReference } = req.body;

      if (!transactionId) {
        res.status(400).json({
          success: false,
          message: "Transaction ID is required",
        });
        return;
      }

      const payment = await paymentService.handlePaymentSuccess(
        transactionId,
        paymentReference
      );

      res.status(200).json({
        success: true,
        message: "Payment marked as successful",
        data: payment,
      });
    } catch (error) {
      console.error("Payment success error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to process payment success";

      res.status(message === "Payment not found" ? 404 : 400).json({
        success: false,
        message,
      });
    }
  }

  static async handlePaymentFailure(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { transactionId, paymentReference } = req.body;

      if (!transactionId) {
        res.status(400).json({
          success: false,
          message: "Transaction ID is required",
        });
        return;
      }

      const payment = await paymentService.handlePaymentFailure(
        transactionId,
        paymentReference
      );

      res.status(200).json({
        success: true,
        message: "Payment marked as failed",
        data: payment,
      });
    } catch (error) {
      console.error("Payment failure error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to process payment failure";

      res.status(message === "Payment not found" ? 404 : 400).json({
        success: false,
        message,
      });
    }
    }
    
    static async createPayHereCheckout(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
      return;
    }

    const checkout = await paymentService.createPayHereCheckout(
      orderId
    );

    res.status(200).json({
      success: true,
      data: checkout,
    });
  } catch (error) {
    console.error("Create PayHere checkout error:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create PayHere checkout",
    });
  }
}

  static async handlePayHereNotification(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      await paymentService.handlePayHereNotification(req.body);
      res.status(200).send("OK");
    } catch (error) {
      console.error("PayHere notification error:", error);

      res.status(400).send(
        error instanceof Error
          ? error.message
          : "Invalid payment notification"
      );
    }
  }
}