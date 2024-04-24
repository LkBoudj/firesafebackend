import z, { Schema } from "zod";

export const LoginSchema: Schema = z.object({
  email: z
    .string({
      required_error: "is required",
    })
    .email(),
  password: z.string({
    required_error: "is required",
  }),
});

export const RegisterSchema = z.object({
  username: z
    .string({
      required_error: " is required",
    })
    .min(1, { message: "The field cannot be left empty" }),
  email: z
    .string({
      required_error: "is required",
    })
    .email(),
  password: z.string({
    required_error: "is required",
  }),
});
