import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories } from "../api/category.api";
import { getProducts } from "../api/product.api";
import type {
  Category,
  Product,
  ProductFilters,
} from "../types/product";

const ITEMS_PER_PAGE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") || ""
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || ""
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories({ limit: 100 });
        setCategories(response.data);
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const filters: ProductFilters = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        };

        if (search.trim()) {
          filters.search = search.trim();
        }

        if (category) {
          filters.category = category;
        }

        if (minPrice) {
          filters.minPrice = Number(minPrice);
        }

        if (maxPrice) {
          filters.maxPrice = Number(maxPrice);
        }

        if (sortBy) {
          filters.sortBy = sortBy;
        }

        const response = await getProducts(filters);

        setProducts(response.data);

        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, search, category, minPrice, maxPrice, sortBy]);

  const updateFilters = (
    newValues: Record<string, string>
  ) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newValues).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    updateFilters({ search: value });
  };

//   const handleCategoryChange = (value: string) => {
//     setCategory(value);
//     updateFilters({ category: value });
//   };

  const handleMinPriceChange = (value: string) => {
    setMinPrice(value);
    updateFilters({ minPrice: value });
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPrice(value);
    updateFilters({ maxPrice: value });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sortBy: value });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");

    setSearchParams({});
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>

        <p className="mt-2 text-gray-500">
          Browse our complete furniture collection.
        </p>
      </div>

      <div className="mb-8 rounded-lg border bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>

            <select
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value);
                    // setPage(1);
                }}
                >
                <option value="">All Categories</option>

                {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                    {item.name}
                    </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Min Price
            </label>

            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              placeholder="0"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Max Price
            </label>

            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              placeholder="100000"
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-black sm:w-64"
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <h2 className="text-lg font-semibold">
            No products found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {pagination.total} products found
            </p>
          </div>

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

                  <h2 className="line-clamp-1 font-semibold">
                    {product.title}
                  </h2>

                  <p className="mt-2 text-lg font-bold">
                    ${Number(product.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`rounded-md px-3 py-2 text-sm ${
                    page === currentPage
                      ? "bg-black text-white"
                      : "border hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === pagination.totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}