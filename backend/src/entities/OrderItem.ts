import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product | null;

  @Column({ name: "product_name", length: 150, type:"varchar" })
  productName!: string;

  @Column({
    name: "unit_price",
    type: "decimal",
    precision: 12,
    scale: 2,
  })
  unitPrice!: number;

  @Column({ type: "int" })
  quantity!: number;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
  })
  subtotal!: number;
}