import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

router.get("/", ProductController.getProducts);
router.get("/slug/:slug", ProductController.getProductBySlug);
router.get("/:id", ProductController.getProductById);

router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.patch("/:id/status", ProductController.updateProductStatus);
router.delete("/:id", ProductController.deleteProduct);

router.post(
  "/payhere/checkout",
  authenticate,
  PaymentController.createPayHereCheckout
);

router.post(
  "/payhere/notify",
  PaymentController.handlePayHereNotification
);

export default router;