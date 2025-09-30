import { z } from "zod";

export const PremiumRangeProtectionSchema = z
  .object({
    premium_start: z
      .string({ required_error: "Premium start is required" })
      .min(1, { message: "Premium start is required" })
      .regex(/^\d+(\.\d{1,2})?$/, {
        message: "Premium start must be a valid decimal number (e.g., 1000.00)",
      }),

    premium_end: z
      .string({ required_error: "Premium end is required" })
      .min(1, { message: "Premium end is required" })
      .regex(/^\d+(\.\d{1,2})?$/, {
        message: "Premium end must be a valid decimal number (e.g., 5000.00)",
      }),

    net_premium: z
      .string({ required_error: "Net premium is required" })
      .min(1, { message: "Net premium is required" })
      .regex(/^\d+(\.\d{1,2})?$/, {
        message: "Net premium must be a valid decimal number (e.g., 3000.00)",
      }),

    api_user_id: z
      .number({ required_error: "API User ID is required" })
      .int("API User ID must be an integer")
      .min(1, { message: "API User ID must be positive" }),

    duration: z
      .number({ required_error: "Duration is required" })
      .int("Duration must be an integer")
      .min(1, { message: "Duration must be at least 1" }),

    duration_type: z.enum(["months", "years", "days"], {
      required_error: "Duration type is required",
      invalid_type_error: "Duration type must be 'months', 'years', or 'days'",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.premium_start > data.premium_end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Premium start cannot be greater than premium end.",
        path: ["premium_start"],
      });
    }
  });

export type PremiumRangeProtectionSchemaType = z.infer<
  typeof PremiumRangeProtectionSchema
>;
