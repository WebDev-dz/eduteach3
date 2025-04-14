// @/lib/db/schema/auth.ts

import {
  pgSchema,
  pgTable,
  uuid,
  timestamp,
  text,
  bigint,
  primaryKey,
  index,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const nextAuthSchema = pgSchema("next_auth");

// Enums
export const userRoleEnum = nextAuthSchema.enum("user_role", [
  "teacher",
  "admin",
  "department_head",
  "school_admin"
]);
// Organizations (for School plan)
export const organizations = nextAuthSchema.table(
  "organizations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    domain: text("domain"),
    logo: text("logo"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    ownerId: uuid("owner_id"),
    maxUsers: integer("max_users").default(50),
  },
  (table) => {
    return [index("domain_idx").on(table.domain)];
  }
);

export const users = nextAuthSchema.table(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { withTimezone: true }),
    image: text("image"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("teacher"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    stripeCustomerId: uuid("stripe_customer_id"),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    lastLoginAt: timestamp("last_login_at"),
  },
  (table) => {
    return [
      index("email_idx").on(table.email),
      index("organization_idx").on(table.organizationId),
    ];
  }
);

export const accounts = nextAuthSchema.table(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: bigint({ mode: "bigint" }),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    oauth_token_secret: text("oauth_token_secret"),
    oauth_token: text("oauth_token"),
  },
  (table) => [
    unique("provider_unique").on(table.provider, table.providerAccountId),
  ]
);

export const sessions = nextAuthSchema.table("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = nextAuthSchema.table(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.identifier, table.token] }),
    unique("token_unique").on(table.token),
  ]
);

// Helper for creating unique constraints
function unique(name: string) {
  return {
    name,
    columns: [] as any[],
    on: function (...columns: any[]) {
      this.columns = columns;
      return this;
    },
  };
}
