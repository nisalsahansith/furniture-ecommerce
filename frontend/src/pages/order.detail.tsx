import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/order.api";
import type { Order } from "../types/order";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Order not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(id);
        setOrder(response);
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Order Not Found
        </h1>

        <p className="mt-2 text-gray-500">
          {error || "Unable to find this order."}
        </p>

        <Link
          to="/orders"
          className="mt-6 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white"
        >
          My Orders
        </Link>
      </div>
    );
  }

  const total =
    order.totalAmount ??
    order.items.reduce(
      (sum, item) =>
        sum + Number(item.unitPrice) * item.quantity,
      0
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-gray-500">
            Order #{order.orderNumber || order.id}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Order Details
          </h1>
        </div>

        <Link
          to="/orders"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← My Orders
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Customer Information
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-900">
                {order.customerName}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">
                {order.customerEmail}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">
                {order.customerPhone}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Shipping Information
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium text-gray-900">
                {order.shippingAddress}
              </p>
            </div>

            <div>
              <p className="text-gray-500">City</p>
              <p className="font-medium text-gray-900">
                {order.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Order Status
          </h2>

          <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {order.status || "PENDING"}
          </span>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Payment Method:{" "}
          <span className="font-medium text-gray-900">
            {order.paymentMethod}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Order Items
        </h2>

        <div className="mt-5 divide-y divide-gray-200">
          {order.items.map((item) => {
            const price = Number(item.unitPrice);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.productName ||
                      `Product #${item.id}`}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    ${price.toFixed(2)} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  ${(price * item.quantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 border-t border-gray-200 pt-5">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}