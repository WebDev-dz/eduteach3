// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

const connectionString = (dotenv.config().parsed as { DATABASE_URL: string }).DATABASE_URL || "";
console.log({connectionString})
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  dbCredentials: {
    url: connectionString,
  }
});
