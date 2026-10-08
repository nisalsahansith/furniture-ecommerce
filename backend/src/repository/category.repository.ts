import { Category } from "../entities/Category";

export interface ICategoryRepository {
  getAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    data: Category[];
    total: number;
  }>;

  getById(id: string): Promise<Category | null>;

  getBySlug(slug: string): Promise<Category | null>;

  create(category: Partial<Category>): Promise<Category>;

  update(
    id: string,
    category: Partial<Category>
  ): Promise<Category | null>;

  delete(id: string): Promise<boolean>;
}