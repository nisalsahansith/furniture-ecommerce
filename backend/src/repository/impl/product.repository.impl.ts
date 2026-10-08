import {
  AppDataSource
} from "../../config/database";
import {
  EntityManager,
  Repository,
} from "typeorm";
import { Product } from "../../entities/Product";
import { Category } from "../../entities/Category";
import {
  CreateProductData,
  IProductRepository,
  ProductListFilters,
  UpdateProductData,
} from "../product.repository";

export class ProductRepositoryImpl
  implements IProductRepository
{
  private readonly productRepository =
    AppDataSource.getRepository(Product);

  private readonly categoryRepository =
    AppDataSource.getRepository(Category);

  async getAll(filters: ProductListFilters) {
    const page = Math.max(filters.page || 1, 1);
    const limit = Math.min(
      Math.max(filters.limit || 12, 1),
      50
    );

    const skip = (page - 1) * limit;

    const query = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .where("product.isActive = :isActive", {
        isActive: true,
      });

    if (filters.search) {
      query.andWhere(
        "(product.name ILIKE :search OR product.description ILIKE :search OR product.sku ILIKE :search)",
        {
          search: `%${filters.search}%`,
        }
      );
    }

    if (filters.category) {
      query.andWhere("category.slug = :category", {
        category: filters.category,
      });
    }

    if (filters.minPrice !== undefined) {
      query.andWhere("product.price >= :minPrice", {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice !== undefined) {
      query.andWhere("product.price <= :maxPrice", {
        maxPrice: filters.maxPrice,
      });
    }

    switch (filters.sortBy) {
      case "price_asc":
        query.orderBy("product.price", "ASC");
        break;

      case "price_desc":
        query.orderBy("product.price", "DESC");
        break;

      case "name_asc":
        query.orderBy("product.name", "ASC");
        break;

      case "name_desc":
        query.orderBy("product.name", "DESC");
        break;

      case "newest":
      default:
        query.orderBy("product.createdAt", "DESC");
        break;
    }

    const [products, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(
    id: string,
    activeOnly = true
  ): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: {
        id,
        ...(activeOnly ? { isActive: true } : {}),
      },
      relations: {
        category: true,
      },
    });
  }

  async getBySlug(
    slug: string,
    activeOnly = true
  ): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: {
        slug,
        ...(activeOnly ? { isActive: true } : {}),
      },
      relations: {
        category: true,
      },
    });
  }

  async getBySku(
    sku: string
  ): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { sku },
    });
  }

  async getBySlugExact(
    slug: string
  ): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { slug },
    });
  }

  async create(
    data: CreateProductData
  ): Promise<Product> {
    const category =
      await this.categoryRepository.findOne({
        where: {
          id: data.categoryId,
          isActive: true,
        },
      });

    if (!category) {
      throw new Error("Category not found");
    }

    const product = this.productRepository.create({
      name: data.name,
      slug: data.slug,
      sku: data.sku,
      description: data.description,
      price: data.price,
      stockQuantity: data.stockQuantity,
      imageUrl: data.imageUrl ?? null,
      category,
      isActive: true,
    });

    return await this.productRepository.save(product);
  }

  async update(
    id: string,
    data: UpdateProductData
  ): Promise<Product | null> {
    const product =
      await this.productRepository.findOne({
        where: { id },
        relations: {
          category: true,
        },
      });

    if (!product) {
      return null;
    }

    if (data.categoryId) {
      const category =
        await this.categoryRepository.findOne({
          where: {
            id: data.categoryId,
            isActive: true,
          },
        });

      if (!category) {
        throw new Error("Category not found");
      }

      product.category = category;
    }

    if (data.name !== undefined) {
      product.name = data.name;
    }

    if (data.slug !== undefined) {
      product.slug = data.slug;
    }

    if (data.sku !== undefined) {
      product.sku = data.sku;
    }

    if (data.description !== undefined) {
      product.description = data.description;
    }

    if (data.price !== undefined) {
      product.price = data.price;
    }

    if (data.stockQuantity !== undefined) {
      product.stockQuantity =
        data.stockQuantity;
    }

    if (data.imageUrl !== undefined) {
      product.imageUrl = data.imageUrl;
    }

    return await this.productRepository.save(
      product
    );
  }

  async updateStatus(
    id: string,
    isActive: boolean
  ): Promise<Product | null> {
    const product =
      await this.productRepository.findOne({
        where: { id },
      });

    if (!product) {
      return null;
    }

    product.isActive = isActive;

    return await this.productRepository.save(
      product
    );
  }

  async delete(id: string): Promise<boolean> {
    const product =
      await this.productRepository.findOne({
        where: { id },
      });

    if (!product) {
      return false;
    }

    await this.productRepository.remove(product);

    return true;
  }

  async save(
    product: Product,
    manager: EntityManager = AppDataSource.manager
  ): Promise<Product> {
    return await manager.getRepository(Product).save(
      product
    );
  }

  async getByIdForOrder(
    id: string,
    manager: EntityManager = AppDataSource.manager
  ): Promise<Product | null> {
    return await manager
      .getRepository(Product)
      .findOne({
        where: {
          id,
          isActive: true,
        },
      });
  }
}