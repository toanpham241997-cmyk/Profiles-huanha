import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export chat models from integration
export * from "./models/chat";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  facebookUrl: text("facebook_url"),
  zaloUrl: text("zalo_url"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  category: text("category").notNull(), // 'web', 'hack', 'game_acc', 'cafe', 'clothes'
  imageUrl: text("image_url").notNull(),
  link: text("link").notNull(), // External buy link
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export const categories = [
  { id: 'web', label: 'Web Services' },
  { id: 'hack', label: 'Game Hacks' },
  { id: 'game_acc', label: 'Game Accounts' },
  { id: 'cafe', label: 'Coffee' },
  { id: 'clothes', label: 'Clothes' },
] as const;
