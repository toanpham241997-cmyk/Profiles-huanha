import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import { registerChatRoutes } from "./replit_integrations/chat/routes";
import { insertUserSchema, insertProductSchema } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // set to true if using https
    })
  );

  // Register Chat Integration Routes
  registerChatRoutes(app);

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const user = await storage.createUser(input);
      req.session.userId = user.id;
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.session.userId = user.id;
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    if (!req.session.userId) {
      return res.json(null);
    }
    const user = await storage.getUser(req.session.userId);
    res.json(user || null);
  });

  app.patch(api.auth.update.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const updates = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.session.userId, updates);
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Product Routes
  app.get(api.products.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const products = await storage.getProducts(category);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const products = [
      // Web Services
      {
        name: "Website Cá Nhân (Basic)",
        description: "Thiết kế website profile cá nhân chuyên nghiệp, giao diện đẹp, responsive.",
        price: "500000",
        category: "web",
        imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Web+Basic",
        link: "https://facebook.com/havanhuan",
      },
      {
        name: "Website Bán Hàng (Pro)",
        description: "Web bán hàng full tính năng: giỏ hàng, thanh toán, quản lý đơn hàng.",
        price: "2000000",
        category: "web",
        imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Web+E-commerce",
        link: "https://facebook.com/havanhuan",
      },
      // Game Hacks
      {
        name: "Hack Map Liên Quân (Mobile)",
        description: "Hack map sáng, hiện địch, an toàn 100% không ban acc.",
        price: "150000",
        category: "hack",
        imageUrl: "https://placehold.co/600x400/10b981/ffffff?text=Hack+Map",
        link: "https://zalo.me/havanhuan",
      },
      {
        name: "Auto Headshot Free Fire",
        description: "Kéo tâm bá đạo, one hit one kill, leo rank thần tốc.",
        price: "200000",
        category: "hack",
        imageUrl: "https://placehold.co/600x400/10b981/ffffff?text=Auto+Headshot",
        link: "https://zalo.me/havanhuan",
      },
      // Game Accounts
      {
        name: "Acc LQ Full Tướng Full Skin",
        description: "Acc trắng thông tin, rank Cao Thủ, full ngọc.",
        price: "500000",
        category: "game_acc",
        imageUrl: "https://placehold.co/600x400/f59e0b/ffffff?text=Acc+LQ",
        link: "https://facebook.com/havanhuan",
      },
      // Cafe
      {
        name: "Cà Phê Sữa Đá (Size L)",
        description: "Đậm đà hương vị cà phê Tây Nguyên, thơm ngon khó cưỡng.",
        price: "25000",
        category: "cafe",
        imageUrl: "https://placehold.co/600x400/78350f/ffffff?text=Cafe+Sua",
        link: "https://shopeefood.vn",
      },
      // Clothes
      {
        name: "Áo Thun Local Brand",
        description: "Chất liệu cotton 100%, form rộng, in hình cool ngầu.",
        price: "150000",
        category: "clothes",
        imageUrl: "https://placehold.co/600x400/3b82f6/ffffff?text=T-Shirt",
        link: "https://shopee.vn",
      },
    ];

    for (const product of products) {
      await storage.createProduct(product as any);
    }
  }
}
