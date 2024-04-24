import { z } from "zod";

export const CreateSchema = z.object({
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

export const updateSchema = z.object({
  username: z
    .string({})
    .min(1, { message: "The field cannot be left empty" })
    .nullable()
    .nullish(),
  email: z.string({}).email().nullable().nullish(),
  password: z.string({}).nullable().nullish(),
});

export const DeleSchema = z.object({
  ids: z.array(z.string()),
});
