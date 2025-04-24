
import {db} from "@/lib/db/"
import { classes, } from '@/lib/db/schema/index';
import { organizations } from "@/lib/db/schema/auth";
import { PgInsertBuilder } from "drizzle-orm/pg-core"

export type ServerGetter = {
   [K in keyof typeof db.query]: Partial<
     Pick<(typeof db.query)[K], "findMany" | "findFirst" | "findUnique" | "create" | "update" | "delete">
   >;
 };
 
 type Promisable<T> = T extends Promise<infer U> ? U : never;
 
 type OverriddenHandler<
   T extends (...args: any[]) => any
 > = (values: any) => Promise<Promisable<ReturnType<T>>>;
 
 export type Server = {
   [K in keyof ServerGetter]: ServerGetter[K] & {
     create?: OverriddenHandler<NonNullable<ServerGetter[K]["findMany"]>>;
     update?: OverriddenHandler<NonNullable<ServerGetter[K]["findMany"]>>;
     delete?: OverriddenHandler<NonNullable<ServerGetter[K]["findMany"]>>;
   };
 };

