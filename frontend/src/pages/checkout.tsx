import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cart.store";
import { createOrder } from "../api/order.api";
import type { PaymentMethod } from "../types/order";
import { createPayHereCheckout } from "../api/payment.api";

export default function Checkout() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    city: "",
    paymentMethod: "PAYHERE" as PaymentMethod,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = getTotalPrice();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await createOrder({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        paymentMethod: formData.paymentMethod,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      const order = response;

      if (!order?.id) {
        throw new Error("Order was created but no order ID was returned.");
      }

      clearCart();

      if (formData.paymentMethod === "PAYHERE") {
        const paymentResponse = await createPayHereCheckout(order.id);

        const form = document.createElement("form");
        form.method = "POST";
        form.action = paymentResponse.data.paymentUrl;

        Object.entries(paymentResponse.data.fields).forEach(
          ([key, value]) => {
            const input = document.createElement("input");

            input.type = "hidden";
            input.name = key;
            input.value = value;

            form.appendChild(input);
          }
        );

        document.body.appendChild(form);
        form.submit();

        return;
      }

      if (formData.paymentMethod === "WHATSAPP") {
        const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

        if (!whatsappNumber) {
          throw new Error(
            "WhatsApp number is not configured. Please contact the administrator."
          );
        }

        const productDetails = items
          .map((item) => {
            const price = Number(item.product.price);
            const subtotal = price * item.quantity;

            return `${item.product.title} x ${item.quantity} - Rs. ${subtotal.toFixed(2)}`;
          })
          .join("\n");

        const message = [
          "Hello, I would like to place an order.",
          "",
          `Order Number: ${order.orderNumber}`,
          "",
          "Customer Details",
          `Name: ${order.customerName}`,
          `Email: ${order.customerEmail}`,
          `Phone: ${order.customerPhone}`,
          "",
          "Delivery Details",
          `Address: ${order.shippingAddress}`,
          `City: ${order.city}`,
          "",
          "Order Items",
          productDetails,
          "",
          `Total: Rs. ${Number(order.totalAmount).toFixed(2)}`,
          "",
          "Please confirm my order. Thank you.",
        ].join("\n");

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          message
        )}`;

        window.location.href = whatsappUrl;

        return;
      }
    } catch (error) {
      console.error("Checkout error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Your Cart is Empty
        </h1>

        <p className="mt-3 text-gray-500">
          Add products before proceeding to checkout.
        </p>

        <Link
          to="/products"
          className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Checkout
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 lg:col-span-2"
        >
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Customer Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                  placeholder="0771234567"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Shipping Information
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Shipping Address
                </label>

                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                  placeholder="Enter your full delivery address"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                  placeholder="Colombo"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Payment Method
            </h2>

            <div className="mt-6 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PAYHERE"
                  checked={formData.paymentMethod === "PAYHERE"}
                  onChange={handleChange}
                />

                <div>
                  <p className="font-medium text-gray-900">
                    PayHere
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay securely using PayHere.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="WHATSAPP"
                  checked={formData.paymentMethod === "WHATSAPP"}
                  onChange={handleChange}
                />

                <div>
                  <p className="font-medium text-gray-900">
                    WhatsApp
                  </p>

                  <p className="text-sm text-gray-500">
                    Place your order through WhatsApp.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-6 py-3.5 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? "Creating Order..." : "Place Order"}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.product.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-medium text-gray-900">
                  Rs.{" "}
                  {(
                    Number(item.product.price) * item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>

              <span>
                Rs. {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}