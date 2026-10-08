import api from "./axios";
import type {
  Product,
  ProductFilters,
  ProductListResponse,
} from "../types/product";

export const getProducts = async (
  filters: ProductFilters = {}
): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>("/products", {
    params: filters,
  });

  return response.data;
};

export const getProductById = async (
  id: string
): Promise<Product> => {
  const response = await api.get<{ success: boolean; data: Product }>(
    `/products/${id}`
  );

  return response.data.data;
};

export const getProductBySlug = async (
  slug: string
): Promise<Product> => {
  const response = await api.get<{ success: boolean; data: Product }>(
    `/products/slug/${slug}`
  );

  return response.data.data;
};