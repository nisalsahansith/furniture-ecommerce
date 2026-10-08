import api from "./axios";
import type { Category } from "../types/product";

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getCategories = async (
  filters: CategoryFilters = {}
): Promise<CategoryListResponse> => {
  const response = await api.get<CategoryListResponse>("/categories", {
    params: filters,
  });

  return response.data;
};

export const getCategoryById = async (
  id: string
): Promise<Category> => {
  const response = await api.get<{ success: boolean; data: Category }>(
    `/categories/${id}`
  );

  return response.data.data;
};