import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/order.api";
import type { Order } from "../types/order";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrders({
          page: 1,
          limit: 10,
        });

        setOrders(response.data);
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            "Failed to load your orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-500">
          View and track your recent orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No orders yet
          </h2>
          <p className="mt-2 text-gray-500">
            Your completed orders will appear here.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded-xl border bg-white p-5 transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order</p>

                  <h2 className="mt-1 font-semibold text-gray-900">
                    {order.orderNumber}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-lg font-bold text-gray-900">
                    Rs. {Number(order.totalAmount).toFixed(2)}
                  </p>

                  <div className="mt-2 flex items-center gap-2 sm:justify-end">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {order.status}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t pt-4 text-sm text-gray-500">
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"} ·{" "}
                {order.paymentMethod}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}