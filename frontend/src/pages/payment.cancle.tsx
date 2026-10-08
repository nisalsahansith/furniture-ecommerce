import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
      <div className="w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl text-red-600">×</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-gray-500">
          Your PayHere payment was cancelled. Your order has not been marked as
          paid.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/orders"
            className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="rounded-lg border px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}