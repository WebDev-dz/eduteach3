import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import * as authSchema from "./schema/auth"
// Create a PostgreSQL connection
const connectionString = process.env.DATABASE_URL || ""
const client = postgres(connectionString)
export const db = drizzle(client, { schema: { ...schema, ...authSchema } })
