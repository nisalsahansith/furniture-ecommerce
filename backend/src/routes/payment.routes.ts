import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { PaymentController } from "../controllers/payment.controller";
import { requireAdmin } from "../middleware/admin.midleware";

const router = Router();

router.post(
  "/payhere/checkout",
  authenticate,
  PaymentController.createPayHereCheckout
);

router.post(
  "/payhere/notify",
  PaymentController.handlePayHereNotification
);

router.get(
  "/order/:orderId",
  authenticate,
  PaymentController.getPaymentsByOrderId
);

router.get(
  "/:id",
  authenticate,
  requireAdmin,
  PaymentController.getPaymentById
);

router.post(
  "/",
  authenticate,
  requireAdmin,
  PaymentController.createPayment
);

router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  PaymentController.updatePayment
);

export default router;