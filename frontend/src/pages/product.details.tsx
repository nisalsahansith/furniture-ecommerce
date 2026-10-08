import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductBySlug } from "../api/product.api";
import type { Product } from "../types/product";
import { useCartStore } from "../store/cart.store";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const isInCart = product
    ? cartItems.some((item) => item.product.id === product.id)
    : false;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getProductBySlug(slug);
        setProduct(response);
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            "Failed to load product details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!showNotification) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowNotification(false);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showNotification]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0 || isInCart) {
      return;
    }

    addItem(product);
    setShowNotification(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Product Not Found
        </h1>

        <p className="mt-2 text-gray-500">
          {error || "The requested product could not be found."}
        </p>

        <Link
          to="/products"
          className="mt-6 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const price = Number(product.price);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {showNotification && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-3 rounded-lg border border-green-200 bg-white px-4 py-3 shadow-lg">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
            ✓
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Added to cart
            </p>

            <p className="text-xs text-gray-500">
              {product.title}
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-white">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full max-h-[550px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[500px] items-center justify-center bg-gray-100 text-gray-400">
              No image available
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          {product.category && (
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500">
              {product.category.name}
            </p>
          )}

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {product.title}
          </h1>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            Rs. {price.toFixed(2)}
          </p>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Description
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {product.description}
            </p>
          </div>

          {product.stock !== undefined && (
            <div className="mt-6">
              {product.stock > 0 ? (
                <p className="text-sm font-medium text-green-600">
                  {product.stock} items available
                </p>
              ) : (
                <p className="text-sm font-medium text-red-600">
                  Out of stock
                </p>
              )}
            </div>
          )}

          {product.stock === 0 ? (
            <button
              type="button"
              disabled
              className="mt-8 w-full cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3.5 font-medium text-gray-500"
            >
              Out of Stock
            </button>
          ) : isInCart ? (
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="mt-8 w-full rounded-lg border border-gray-900 bg-white px-6 py-3.5 font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white"
            >
              View Cart
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 w-full rounded-lg bg-gray-900 px-6 py-3.5 font-medium text-white transition hover:bg-gray-800"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}