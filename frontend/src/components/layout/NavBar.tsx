import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { logout } from "../../api/auth.api";

export default function Navbar() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } catch {
      // Clear local auth even if the backend logout request fails.
    } finally {
      clearAuth();
      setLoggingOut(false);
      setMenuOpen(false);
      navigate("/login");
    }
  };

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-bold text-gray-900"
          >
            Furniture Store
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              Cart
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  My Orders
                </Link>

                <span className="max-w-32 truncate text-sm text-gray-500">
                  {user?.name}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-black md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black"
              >
                Products
              </Link>

              <Link
                to="/cart"
                onClick={closeMenu}
                className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black"
              >
                Cart
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black"
                  >
                    My Orders
                  </Link>

                  <div className="mt-2 border-t border-gray-100 px-3 pt-4">
                    <p className="truncate text-sm text-gray-500">
                      {user?.name}
                    </p>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="mt-3 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-4">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-md px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-md bg-black px-4 py-3 text-center text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}