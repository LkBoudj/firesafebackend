import { z } from "zod";

export const CreateSchema = z.object({
  name: z
    .string({
      required_error: "is required",
    })
    .min(1, { message: "can be empty" }),
  username: z
    .string({
      required_error: "is required",
    })
    .min(1, { message: "can be empty" }),
  password: z
    .string({
      required_error: "is required",
    })
    .min(1, { message: "can be empty" }),
  rtsp: z.string({ required_error: "is required" }).url(),
  isActive: z.boolean().default(true),
});

export const updateSchema = z.object({
  username: z
    .string({})
    .min(1, { message: "The field cannot be left empty" })
    .nullable()
    .nullish(),
  name: z
    .string({})
    .min(1, { message: "The field cannot be left empty" })
    .nullable()
    .nullish(),
  rtsp: z
    .string()
    .min(1, { message: "The field cannot be left empty" })
    .url()
    .nullable()
    .nullish(),

  password: z.string({}).nullable().nullish(),
});

export const DeleSchema = z.object({
  ids: z.array(z.string()),
});
