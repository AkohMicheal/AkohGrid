import { pgTable, text, serial, integer, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const paymentProviderEnum = pgEnum("payment_provider", [
  "stripe",
  "paystack",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "initiated",
  "successful",
  "failed",
  "refunded",
]);

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "set null" }),
  provider: paymentProviderEnum("provider").notNull(),
  providerReference: text("provider_reference").notNull().unique(),
  transactionId: text("transaction_id"),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull(),
  status: paymentStatusEnum("status").default("initiated").notNull(),
  idempotencyKey: text("idempotency_key").unique(),
  rawPayload: jsonb("raw_payload"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
