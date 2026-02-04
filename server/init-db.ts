import { db } from "./db";

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' NOT NULL,
      avatar_url TEXT,
      bio TEXT,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      facebook_url TEXT,
      zalo_url TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      link TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `);
}
