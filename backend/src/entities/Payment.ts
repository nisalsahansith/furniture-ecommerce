import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Order, (order) => order.payments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order!: Order;

  @Column({ name: "transaction_id", nullable: true, length: 150, type:"varchar" })
  transactionId!: string | null;

  @Column({
    type: "decimal",
    precision: 12,
    scale: 2,
  })
  amount!: number;

  @Column({ length: 50, type:"varchar"})
  method!: string;

  @Column({ length: 50, type:"varchar" })
  status!: string;

  @Column({ name: "payment_reference", nullable: true, length: 150, type:"varchar" })
  paymentReference!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}