import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").default("USD").notNull(),
  inventory: integer("inventory").default(0).notNull(),
  sizes: text("sizes").array().notNull(),
  colors: text("colors").array().notNull(),
  images: jsonb("images").notNull(),
  categorySlug: text("category_slug")
    .references(() => categories.slug, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
