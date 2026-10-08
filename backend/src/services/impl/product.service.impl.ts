import { Product } from "../../entities/Product";
import { CreateProductData, IProductRepository, ProductListFilters, UpdateProductData } from "../../repository/product.repository";
import { IProductService } from "../product.service";

export class ProductServiceImpl implements IProductService {
  constructor(
    private readonly productRepository: IProductRepository
  ) {}

  async getProducts(filters: ProductListFilters) {
    return await this.productRepository.getAll(filters);
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.getById(
      id,
      true
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.getBySlug(
      slug,
      true
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async createProduct(
    data: CreateProductData
  ): Promise<Product> {
    const existingSku = await this.productRepository.getBySku(
      data.sku
    );

    if (existingSku) {
      throw new Error("Product SKU already exists");
    }

    const existingSlug =
      await this.productRepository.getBySlugExact(data.slug);

    if (existingSlug) {
      throw new Error("Product slug already exists");
    }

    return await this.productRepository.create(data);
  }

  async updateProduct(
    id: string,
    data: UpdateProductData
  ): Promise<Product> {
    const existingProduct =
      await this.productRepository.getById(id, false);

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    if (
      data.sku !== undefined &&
      data.sku !== existingProduct.sku
    ) {
      const existingSku =
        await this.productRepository.getBySku(data.sku);

      if (
        existingSku &&
        existingSku.id !== existingProduct.id
      ) {
        throw new Error("Product SKU already exists");
      }
    }

    if (
      data.slug !== undefined &&
      data.slug !== existingProduct.slug
    ) {
      const existingSlug =
        await this.productRepository.getBySlugExact(data.slug);

      if (
        existingSlug &&
        existingSlug.id !== existingProduct.id
      ) {
        throw new Error("Product slug already exists");
      }
    }

    const product = await this.productRepository.update(
      id,
      data
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async updateProductStatus(
    id: string,
    isActive: boolean
  ): Promise<Product> {
    const product =
      await this.productRepository.updateStatus(
        id,
        isActive
      );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const deleted = await this.productRepository.delete(id);

    if (!deleted) {
      throw new Error("Product not found");
    }
  }
}