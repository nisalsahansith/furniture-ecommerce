import "reflect-metadata";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { AppDataSource } from "./config/database";
import { User, UserRole } from "./entities/User";
import { Category } from "./entities/Category";
import { Product } from "./entities/Product";

dotenv.config();

const seed = async () => {
  try {
    await AppDataSource.initialize();

    console.log("Database connected.");

    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);
    const productRepository = AppDataSource.getRepository(Product);

    // Admin

    const adminEmail = "admin@furniturehub.com";

    let admin = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!admin) {
      const passwordHash = await bcrypt.hash("Admin@12345", 12);

      admin = userRepository.create({
        name: "FurnitureHub Admin",
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
      });

      await userRepository.save(admin);

      console.log("Admin created.");
    }

    // Categories
    const categoryData = [
      {
        name: "Chairs",
        slug: "chairs",
        description: "Comfortable chairs for home and office spaces.",
      },
      {
        name: "Tables",
        slug: "tables",
        description: "Dining, coffee and workspace tables.",
      },
      {
        name: "Sofas",
        slug: "sofas",
        description: "Modern sofas designed for comfortable living spaces.",
      },
      {
        name: "Beds",
        slug: "beds",
        description: "Stylish and comfortable beds for modern bedrooms.",
      },
      {
        name: "Office Furniture",
        slug: "office-furniture",
        description: "Professional furniture for productive workspaces.",
      },
      {
        name: "Storage",
        slug: "storage",
        description: "Practical storage solutions for every room.",
      },
    ];

    const categories: Record<string, Category> = {};

    for (const data of categoryData) {
      let category = await categoryRepository.findOne({
        where: { slug: data.slug },
      });

      if (!category) {
        category = categoryRepository.create(data);
        await categoryRepository.save(category);
      }

      categories[data.slug] = category;
    }

    console.log("Categories ready.");

    // Products
    const productData = [
      {
        name: "Nordic Lounge Chair",
        slug: "nordic-lounge-chair",
        sku: "CHR-NORD-001",
        description:
          "A modern lounge chair with a comfortable upholstered seat and elegant wooden legs.",
        price: 45900,
        stockQuantity: 18,
        imageUrl:
          "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91",
        category: categories["chairs"],
      },
      {
        name: "Modern Accent Chair",
        slug: "modern-accent-chair",
        sku: "CHR-ACC-002",
        description:
          "A stylish accent chair designed to add comfort and character to living spaces.",
        price: 38900,
        stockQuantity: 12,
        imageUrl:
          "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c",
        category: categories["chairs"],
      },
      {
        name: "Ergonomic Office Chair",
        slug: "ergonomic-office-chair",
        sku: "OFF-CHR-001",
        description:
          "An ergonomic office chair with adjustable height and supportive backrest.",
        price: 64900,
        stockQuantity: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
        category: categories["office-furniture"],
      },
      {
        name: "Oak Dining Table",
        slug: "oak-dining-table",
        sku: "TAB-OAK-001",
        description:
          "Solid oak dining table designed for family meals and gatherings.",
        price: 125000,
        stockQuantity: 8,
        imageUrl:
          "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf",
        category: categories["tables"],
      },
      {
        name: "Marble Coffee Table",
        slug: "marble-coffee-table",
        sku: "TAB-MAR-002",
        description:
          "Contemporary coffee table featuring a premium marble-inspired top.",
        price: 78500,
        stockQuantity: 10,
        imageUrl:
          "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc",
        category: categories["tables"],
      },
      {
        name: "Luna Three Seater Sofa",
        slug: "luna-three-seater-sofa",
        sku: "SOF-LUNA-001",
        description:
          "A spacious three-seater sofa with soft fabric upholstery and deep cushions.",
        price: 185000,
        stockQuantity: 6,
        imageUrl:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
        category: categories["sofas"],
      },
      {
        name: "Cloud Fabric Sofa",
        slug: "cloud-fabric-sofa",
        sku: "SOF-CLOUD-002",
        description:
          "A comfortable contemporary sofa designed for relaxed living rooms.",
        price: 215000,
        stockQuantity: 5,
        imageUrl:
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e",
        category: categories["sofas"],
      },
      {
        name: "Modern Platform Bed",
        slug: "modern-platform-bed",
        sku: "BED-PLAT-001",
        description:
          "A minimalist platform bed with a clean modern frame.",
        price: 145000,
        stockQuantity: 7,
        imageUrl:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        category: categories["beds"],
      },
      {
        name: "King Storage Bed",
        slug: "king-storage-bed",
        sku: "BED-STOR-002",
        description:
          "A spacious king-size bed with integrated under-bed storage.",
        price: 198000,
        stockQuantity: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
        category: categories["beds"],
      },
      {
        name: "Executive Office Desk",
        slug: "executive-office-desk",
        sku: "OFF-DSK-001",
        description:
          "A spacious executive desk suitable for professional home offices.",
        price: 112000,
        stockQuantity: 9,
        imageUrl:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
        category: categories["office-furniture"],
      },
      {
        name: "Oak Bookshelf",
        slug: "oak-bookshelf",
        sku: "STR-BOOK-001",
        description:
          "A versatile oak bookshelf with multiple storage compartments.",
        price: 68500,
        stockQuantity: 11,
        imageUrl:
          "https://images.unsplash.com/photo-1594620302200-9a762244a156",
        category: categories["storage"],
      },
      {
        name: "Modern Side Cabinet",
        slug: "modern-side-cabinet",
        sku: "STR-CAB-002",
        description:
          "A compact side cabinet providing practical and stylish storage.",
        price: 49500,
        stockQuantity: 14,
        imageUrl:
          "https://images.unsplash.com/photo-1558997519-83ea9252edf8",
        category: categories["storage"],
      },
    ];

    for (const data of productData) {
      const existingProduct = await productRepository.findOne({
        where: { sku: data.sku },
      });

      if (!existingProduct) {
        const product = productRepository.create(data);
        await productRepository.save(product);
      }
    }

    console.log("Products ready.");
    console.log("");
    console.log("Seed completed successfully.");
    console.log("");
    console.log("Admin login:");
    console.log(`Email: ${adminEmail}`);
    console.log("Password: Admin@12345");

    await AppDataSource.destroy();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seed();