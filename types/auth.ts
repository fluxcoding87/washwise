import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(1, "User Name is Required"),
  password: z.string().min(6, "Password is required"),
});

export const signUpFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password is required"),
});
