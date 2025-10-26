import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" }); // pastikan ada file .env di root apps/we-be

export default defineConfig({
    schema: "./drizzle/schema.ts",
    out: "./drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
