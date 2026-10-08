import { EntityManager } from "typeorm";
import { Product } from "../entities/Product";

export interface ProductListFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export interface ProductListResult {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductData {
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
  categoryId: string;
}

export interface UpdateProductData {
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  imageUrl?: string | null;
  categoryId?: string;
}

export interface IProductRepository {
  getAll(filters: ProductListFilters): Promise<ProductListResult>;

  getById(
    id: string,
    activeOnly?: boolean
  ): Promise<Product | null>;

  getBySlug(
    slug: string,
    activeOnly?: boolean
  ): Promise<Product | null>;

  getBySku(sku: string): Promise<Product | null>;

  getBySlugExact(slug: string): Promise<Product | null>;

  create(data: CreateProductData): Promise<Product>;

  update(
    id: string,
    data: UpdateProductData
  ): Promise<Product | null>;

  updateStatus(
    id: string,
    isActive: boolean
  ): Promise<Product | null>;

  delete(id: string): Promise<boolean>;

  save(
    product: Product,
    manager?: EntityManager
  ): Promise<Product>;

  getByIdForOrder(
    id: string,
    manager?: EntityManager
  ): Promise<Product | null>;
}