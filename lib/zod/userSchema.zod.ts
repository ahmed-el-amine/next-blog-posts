import { z } from "zod";

const base = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  })
  .strip();

export const userLoginSchema = base;

export const userRegisterSchema = base.extend({
  name: z.string().min(3, "Name must be between 3 and 20 characters").max(20, "Name must be between 3 and 20 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
