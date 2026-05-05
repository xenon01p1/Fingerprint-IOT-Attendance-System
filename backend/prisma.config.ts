import "dotenv/config";
import { defineConfig } from "prisma/config";

// Ensure the URL exists or the process fails early with a clear message
const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // We use the variable here which is now guaranteed to be a 'string'
    url: databaseUrl,
  },
});