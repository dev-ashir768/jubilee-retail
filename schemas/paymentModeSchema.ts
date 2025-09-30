import z from "zod";

export const PaymentModeSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(2, { message: "Name should be 2 characters long" })
    .toLowerCase(),
  payment_code: z
    .string({
      required_error: "Payment code is required",
    })
    .trim()
    .min(2, { message: "Payment code should be 2 characters long" }),
});

export type PaymentModeSchemaType = z.infer<typeof PaymentModeSchema>;
