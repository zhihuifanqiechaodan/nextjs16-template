export * from "@/lib/db/auth-schema";
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const category = mysqlTable("category", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sort: int("sort").default(0).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const product = mysqlTable("product", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image"),
  categoryId: varchar("category_id", { length: 36 }).references(
    () => category.id
  ),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // 售价
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }), // 原价
  description: text("description"), // 菜品描述
  // 规格配置: [{ name: '口味', options: ['不辣', '微辣'], required: true }]
  specifications: json("specifications"),
  stock: int("stock").default(0).notNull(), // 库存
  sort: int("sort").default(0).notNull(), // 排序
  status: boolean("status").default(true).notNull(), // 上下架状态, true: 上架, false: 下架
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const productRelations = relations(product, ({ one }) => ({
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}));
