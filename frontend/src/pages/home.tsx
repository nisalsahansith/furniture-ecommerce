import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/category.api";
import { getProducts } from "../api/product.api";
import type { Category, Product } from "../types/product";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, productResponse] = await Promise.all([
          getCategories({ limit: 8 }),
          getProducts({ page: 1, limit: 8 }),
        ]);

        setCategories(categoryResponse.data);
        setProducts(productResponse.data);
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            "Failed to load store data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-gray-900 px-4 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gray-400">
              Quality Furniture
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Make Your Home Feel Like Home
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-300">
              Discover stylish and comfortable furniture designed to
              make every space better.
            </p>

            <div className="mt-8">
              <Link
                to="/products"
                className="inline-block rounded-md bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mx-auto mt-6 max-w-7xl px-4">
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <p className="mt-1 text-sm text-gray-500">
              Find furniture for every room.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">
            No categories available.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="rounded-lg border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                {category.imageUrl && (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="mb-4 h-32 w-full rounded-md object-cover"
                  />
                )}

                <h3 className="font-semibold">{category.name}</h3>

                {category.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Latest Products</h2>
              <p className="mt-1 text-sm text-gray-500">
                Explore our latest furniture collection.
              </p>
            </div>

            <Link
              to="/products"
              className="text-sm font-medium hover:underline"
            >
              View All
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-sm text-gray-500">
              No products available.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group overflow-hidden rounded-lg border bg-white transition hover:shadow-md"
                >
                  <div className="aspect-square bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="mb-1 text-xs text-gray-500">
                      {product.category?.name || "Furniture"}
                    </p>

                    <h3 className="font-semibold">
                      {product.title}
                    </h3>

                    <p className="mt-2 text-lg font-bold">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}