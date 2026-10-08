import { useEffect } from "react";
import { refreshToken } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export const useAuthInit = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setInitializing = useAuthStore(
    (state) => state.setInitializing
  );

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const response = await refreshToken();

        const accessToken =
          response.data?.accessToken ?? response.accessToken;

        const user =
          response.data?.user ?? response.user;

        if (!accessToken || !user) {
          if (mounted) {
            clearAuth();
          }

          return;
        }

        if (mounted) {
          setAuth(accessToken, user);
        }
      } catch {
        if (mounted) {
          clearAuth();
        }
      } finally {
        if (mounted) {
          setInitializing(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [setAuth, clearAuth, setInitializing]);
};