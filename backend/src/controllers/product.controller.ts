import { Request, Response } from "express";
import { productService } from "../services/service.container";

export class ProductController {
  static async getProducts(req: Request, res: Response) {
    try {
      const result = await productService.getProducts({
        page: req.query.page
          ? Number(req.query.page)
          : 1,
        limit: req.query.limit
          ? Number(req.query.limit)
          : 12,
        search:
          typeof req.query.search === "string"
            ? req.query.search
            : undefined,
        category:
          typeof req.query.category === "string"
            ? req.query.category
            : undefined,
        minPrice: req.query.minPrice
          ? Number(req.query.minPrice)
          : undefined,
        maxPrice: req.query.maxPrice
          ? Number(req.query.maxPrice)
          : undefined,
        sortBy:
          typeof req.query.sortBy === "string"
            ? req.query.sortBy
            : undefined,
      });

      return res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Get products error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch products",
      });
    }
  }

  static async getProductById(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const product = await productService.getProductById(
        req.params.id
      );

      return res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Get product error:", error);

      if (
        error instanceof Error &&
        error.message === "Product not found"
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to fetch product",
      });
    }
  }

  static async getProductBySlug(
    req: Request<{ slug: string }>,
    res: Response
  ) {
    try {
      const product =
        await productService.getProductBySlug(
          req.params.slug
        );

      return res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error(
        "Get product by slug error:",
        error
      );

      if (
        error instanceof Error &&
        error.message === "Product not found"
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to fetch product",
      });
    }
  }

  static async createProduct(
    req: Request,
    res: Response
  ) {
    try {
      const product =
        await productService.createProduct(req.body);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error(
        "Create product error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create product",
      });
    }
  }

  static async updateProduct(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const product =
        await productService.updateProduct(
          req.params.id,
          req.body
        );

      return res.json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update product";

      const status =
        message === "Product not found"
          ? 404
          : 400;

      return res.status(status).json({
        success: false,
        message,
      });
    }
  }

  static async updateProductStatus(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be a boolean",
        });
      }

      const product =
        await productService.updateProductStatus(
          req.params.id,
          isActive
        );

      return res.json({
        success: true,
        message:
          "Product status updated successfully",
        data: product,
      });
    } catch (error) {
      console.error(
        "Update product status error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to update product status";

      const status =
        message === "Product not found"
          ? 404
          : 400;

      return res.status(status).json({
        success: false,
        message,
      });
    }
  }

  static async deleteProduct(
    req: Request<{ id: string }>,
    res: Response
  ) {
    try {
      await productService.deleteProduct(
        req.params.id
      );

      return res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete product";

      const status =
        message === "Product not found"
          ? 404
          : 400;

      return res.status(status).json({
        success: false,
        message,
      });
    }
  }
}