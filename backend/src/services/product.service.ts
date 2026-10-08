import { Product } from "../entities/Product";
import { CreateProductData, ProductListFilters, ProductListResult, UpdateProductData } from "../repository/product.repository";


export interface IProductService {
  getProducts(
    filters: ProductListFilters
  ): Promise<ProductListResult>;

  getProductById(id: string): Promise<Product>;

  getProductBySlug(slug: string): Promise<Product>;

  createProduct(data: CreateProductData): Promise<Product>;

  updateProduct(
    id: string,
    data: UpdateProductData
  ): Promise<Product>;

  updateProductStatus(
    id: string,
    isActive: boolean
  ): Promise<Product>;

  deleteProduct(id: string): Promise<void>;
}