import { z } from "zod";

const base = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .strip();

export const loginUserSchema = base;
