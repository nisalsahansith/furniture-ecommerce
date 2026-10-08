import { Request, Response } from "express";
import {
  OrderStatus,
  PaymentMethod,
} from "../entities/Order";
import { orderService } from "../services/service.container";

class OrderController {
  static async createOrder(
    req: Request,
    res: Response
  ) {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        paymentMethod,
        items,
      } = req.body;

      if (
        !customerName ||
        !customerEmail ||
        !customerPhone ||
        !shippingAddress ||
        !city
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All customer and shipping details are required",
        });
      }

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Order must contain at least one item",
        });
      }

      if (
        paymentMethod !== undefined &&
        paymentMethod !== null &&
        !Object.values(PaymentMethod).includes(
          paymentMethod
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment method",
        });
      }

      const userId =
        req.user?.userId ?? null;

      const order =
        await orderService.createOrder(
          userId,
          {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            city,
            paymentMethod:
              paymentMethod ?? null,
            items,
          }
        );

      return res.status(201).json({
        success: true,
        message:
          "Order placed successfully",
        data: order,
      });
    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to place order",
      });
    }
  }

  static async getCustomerOrders(
    req: Request,
    res: Response
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });
      }

      const orders =
        await orderService.getCustomerOrders(
          userId
        );

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error(
        "Get customer orders error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch orders",
      });
    }
  }

  static async getCustomerOrderById(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required",
        });
      }

      const order =
        await orderService.getCustomerOrderById(
          userId,
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error(
        "Get customer order error:",
        error
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Order not found",
      });
    }
  }

  static async getAllOrders(
    req: Request,
    res: Response
  ) {
    try {
      const orders =
        await orderService.getAllOrders();

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error(
        "Get all orders error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch orders",
      });
    }
  }

  static async getOrderById(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const order =
        await orderService.getOrderById(
          req.params.id
        );

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error(
        "Get order error:",
        error
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Order not found",
      });
    }
  }

  static async updateOrderStatus(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            "Order status is required",
        });
      }

      if (
        !Object.values(OrderStatus).includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status",
        });
      }

      const order =
        await orderService.updateOrderStatus(
          req.params.id,
          status
        );

      return res.status(200).json({
        success: true,
        message:
          "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
      });
    }
  }
}

export default OrderController;