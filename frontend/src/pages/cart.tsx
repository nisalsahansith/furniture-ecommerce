import { Link } from "react-router-dom";
import { useCartStore } from "../store/cart.store";


export default function Cart() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Your Cart is Empty
        </h1>

        <p className="mt-3 text-gray-500">
          Add some products to your cart to continue.
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

  const total = getTotalPrice();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const price = Number(item.product.price);

            return (
              <div
                key={item.product.id}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      {item.product.title}
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="mt-2 text-gray-600">
                    ${price.toFixed(2)}
                  </p>

                  <div className="mt-auto flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                      className="h-8 w-8 rounded border border-gray-300"
                    >
                      -
                    </button>

                    <span className="w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                      className="h-8 w-8 rounded border border-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Order Summary
          </h2>

          <div className="mt-6 flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">
              ${total.toFixed(2)}
            </span>
          </div>

          <div className="mt-3 flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-semibold">Free</span>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-lg bg-gray-900 px-6 py-3 text-center font-medium text-white hover:bg-gray-800"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}