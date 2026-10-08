import { Request, Response } from "express";
import { categoryService } from "../services/service.container";

class CategoryController {
  async getAllCategories(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined;

      const result = await categoryService.getAll(page, limit, search);

      return res.json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      console.error("Get categories error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
      });
    }
  }

  async getCategoryById(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const category = await categoryService.getById(req.params.id);

      return res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error("Get category error:", error);

      if (
        error instanceof Error &&
        error.message === "Category not found"
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to fetch category",
      });
    }
  }

  async getCategoryBySlug(
    req: Request<{ slug: string }>,
    res: Response
  ) {
    try {
      const category = await categoryService.getBySlug(
        req.params.slug
      );

      return res.json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error("Get category by slug error:", error);

      if (
        error instanceof Error &&
        error.message === "Category not found"
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to fetch category",
      });
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const category = await categoryService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      console.error("Create category error:", error);

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create category",
      });
    }
  }

  async updateCategory(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const category = await categoryService.update(
        req.params.id,
        req.body
      );

      return res.json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error) {
      console.error("Update category error:", error);

      if (
        error instanceof Error &&
        error.message === "Category not found"
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update category",
      });
    }
  }

  async deleteCategory(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      await categoryService.delete(req.params.id);

      return res.json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Delete category error:", error);

      if (
        error instanceof Error &&
        error.message === "Category not found"
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to delete category",
      });
    }
  }
}

export default new CategoryController();