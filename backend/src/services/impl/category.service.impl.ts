import { Category } from "../../entities/Category";
import { ICategoryRepository } from "../../repository/category.repository";
import { ICategoryService } from "../category.service";

export class CategoryServiceImpl
  implements ICategoryService
{
  constructor(
    private readonly categoryRepository: ICategoryRepository
  ) {}

  async getAll(
    page: number,
    limit: number,
    search?: string
  ) {
    return await this.categoryRepository.getAll(
      page,
      limit,
      search
    );
  }

  async getById(id: string): Promise<Category> {
    const category =
      await this.categoryRepository.getById(id);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async getBySlug(slug: string): Promise<Category> {
    const category =
      await this.categoryRepository.getBySlug(slug);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async create(
    data: Partial<Category>
  ): Promise<Category> {
    const existingCategory =
      data.slug
        ? await this.categoryRepository.getBySlug(data.slug)
        : null;

    if (existingCategory) {
      throw new Error("Category slug already exists");
    }

    return await this.categoryRepository.create(data);
  }

  async update(
    id: string,
    data: Partial<Category>
  ): Promise<Category> {
    if (data.slug) {
      const existingCategory =
        await this.categoryRepository.getBySlug(data.slug);

      if (
        existingCategory &&
        existingCategory.id !== id
      ) {
        throw new Error("Category slug already exists");
      }
    }

    const category =
      await this.categoryRepository.update(id, data);

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }

  async delete(id: string): Promise<void> {
    const deleted =
      await this.categoryRepository.delete(id);

    if (!deleted) {
      throw new Error("Category not found");
    }
  }
}