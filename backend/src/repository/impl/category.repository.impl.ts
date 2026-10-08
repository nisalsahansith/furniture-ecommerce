import { AppDataSource } from "../../config/database";
import { Category } from "../../entities/Category";
import { ICategoryRepository } from "../category.repository";

export class CategoryRepositoryImpl implements ICategoryRepository {
  private readonly repository =
    AppDataSource.getRepository(Category);

  async getAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    data: Category[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const query = this.repository
      .createQueryBuilder("category")
      .orderBy("category.created_at", "DESC")
      .skip(skip)
      .take(limit);

    if (search) {
      query.where(
        "LOWER(category.name) LIKE LOWER(:search)",
        {
          search: `%${search}%`,
        }
      );
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
    };
  }

  async getById(id: string): Promise<Category | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async getBySlug(slug: string): Promise<Category | null> {
    return await this.repository.findOne({
      where: { slug },
    });
  }

  async create(
    category: Partial<Category>
  ): Promise<Category> {
    const newCategory = this.repository.create(category);

    return await this.repository.save(newCategory);
  }

  async update(
    id: string,
    category: Partial<Category>
  ): Promise<Category | null> {
    const existingCategory = await this.repository.findOne({
      where: { id },
    });

    if (!existingCategory) {
      return null;
    }

    Object.assign(existingCategory, category);

    return await this.repository.save(existingCategory);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return result.affected !== 0;
  }
}