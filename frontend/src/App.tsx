import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthInit } from "./hooks/UseAuthInit";

import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/auth/ProtectedRoutes";

import CustomerLayout from "./layout/CustomerLayout";
import Home from "./pages/home";
import Cart from "./pages/cart";
import Products from "./pages/product";
import ProductDetails from "./pages/product.details";
import Checkout from "./pages/checkout";
import OrderDetails from "./pages/order.detail";
import Orders from "./pages/orders";
import PaymentCancel from "./pages/payment.cancle";
import PaymentSuccess from "./pages/payment.success";

function App() {
  return (
    <BrowserRouter>
      <AuthInitializer />

      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function AuthInitializer() {
  useAuthInit();
  return null;
}

export default App;