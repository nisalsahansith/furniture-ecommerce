import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
      <div className="w-full rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl text-green-600">✓</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Payment Submitted
        </h1>

        <p className="mt-3 text-gray-500">
          Your payment has been submitted successfully. We are waiting for
          PayHere to confirm the payment.
        </p>

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          Payment status will be updated automatically after PayHere sends
          confirmation to our server.
        </div>

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