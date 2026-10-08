import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./Category";
import { OrderItem } from "./OrderItem";
import { boolean } from "zod";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type:"varchar",length: 150 })
  name!: string;

  @Column({ unique: true, type:"varchar", length: 180 })
  slug!: string;

  @Column({ unique: true, type:"varchar", length: 50 })
  sku!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price!: number;

  @Column({ name: "stock_quantity", type: "int", default: 0 })
  stockQuantity!: number;

  @Column({ name: "image_url", type: "text", nullable: true })
  imageUrl!: string | null;

  @Column({ type:"boolean", name: "is_active", default: true })
  isActive!: boolean;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "category_id" })
  category!: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems!: OrderItem[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}