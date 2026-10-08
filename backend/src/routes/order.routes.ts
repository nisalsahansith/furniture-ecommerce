import { Router } from "express";
import OrderController from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.midleware";

const router = Router();

// Customer
router.post("/", authenticate, OrderController.createOrder);
router.get("/", authenticate, OrderController.getCustomerOrders);

// Admin
router.get(
  "/admin/all",
  authenticate,
  requireAdmin,
  OrderController.getAllOrders
);

router.get(
  "/admin/:id",
  authenticate,
  requireAdmin,
  OrderController.getOrderById
);

router.patch(
  "/admin/:id/status",
  authenticate,
  requireAdmin,
  OrderController.updateOrderStatus
);

router.get("/:id", authenticate, OrderController.getCustomerOrderById);

export default router;