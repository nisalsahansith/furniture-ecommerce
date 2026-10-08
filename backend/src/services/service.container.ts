import { PayHereGateway } from "../gateway/payhere.gateway";
import { CategoryRepositoryImpl } from "../repository/impl/category.repository.impl";
import { OrderRepositoryImpl } from "../repository/impl/order.repository.impl";
import { OrderItemRepositoryImpl } from "../repository/impl/orderitem.repository.impl";
import { PaymentRepositoryImpl } from "../repository/impl/payment.repository.impl";
import { ProductRepositoryImpl } from "../repository/impl/product.repository.impl";
import { CategoryServiceImpl } from "./impl/category.service.impl";
import { OrderServiceImpl } from "./impl/order.service.impl";
import { PaymentServiceImpl } from "./impl/payment.service.impl";
import { ProductServiceImpl } from "./impl/product.service.impl";

const categoryRepository = new CategoryRepositoryImpl();
const productRepository = new ProductRepositoryImpl();
const orderRepository = new OrderRepositoryImpl();
const orderItemRepository = new OrderItemRepositoryImpl();
const paymentRepository = new PaymentRepositoryImpl();

export const categoryService = new CategoryServiceImpl(
  categoryRepository
);

export const productService = new ProductServiceImpl(
  productRepository
);

export const orderService = new OrderServiceImpl(
  orderRepository,
  orderItemRepository,
  productRepository
);

const payHereGateway = new PayHereGateway();

export const paymentService = new PaymentServiceImpl(
  paymentRepository,
  orderRepository,
  payHereGateway
);