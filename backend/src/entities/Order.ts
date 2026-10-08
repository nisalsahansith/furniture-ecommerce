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
import { User } from "./User";
import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  PAYHERE = "PAYHERE",
  WHATSAPP = "WHATSAPP",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    name: "order_number",
    unique: true,
    length: 30,
    type:"varchar"
  })
  orderNumber!: string;

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "user_id" })
  user!: User | null;

  @Column({ name: "customer_name", length: 100, type:"varchar" })
  customerName!: string;

  @Column({ name: "customer_email", length: 150, type:"varchar" })
  customerEmail!: string;

  @Column({ name: "customer_phone", length: 30, type:"varchar" })
  customerPhone!: string;

  @Column({ name: "shipping_address", type: "text" })
  shippingAddress!: string;

  @Column({ length: 100, type:"varchar" })
  city!: string;

  @Column({
    name: "total_amount",
    type: "decimal",
    precision: 12,
    scale: 2,
  })
  totalAmount!: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus!: PaymentStatus;

  @Column({
    name: "payment_method",
    type: "enum",
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod!: PaymentMethod | null;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items!: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments!: Payment[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}