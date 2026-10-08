import { Category } from "../entities/Category";

export interface ICategoryService {
  getAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    data: Category[];
    total: number;
  }>;

  getById(id: string): Promise<Category>;

  getBySlug(slug: string): Promise<Category>;

  create(data: Partial<Category>): Promise<Category>;

  update(
    id: string,
    data: Partial<Category>
  ): Promise<Category>;

  delete(id: string): Promise<void>;
}