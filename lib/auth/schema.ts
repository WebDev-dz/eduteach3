import { z } from "zod"

// User schema for validation
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  
  export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    terms: z.boolean(),
    lastName: z.string().min(1),
    role: z.enum(["teacher", "admin", "department_head", "school_admin"]),
  })