import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const CourierSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  api_code: z
    .string()
    .min(1, "Api code is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  account_number: z
    .string()
    .min(1, "Account number is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  user: z
    .string()
    .min(1, "User is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  book_url: z
    .string({
      invalid_type_error: "Book url must be string",
    })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    })
    .optional(),
  tracking_url: z
    .string({
      invalid_type_error: "Tracking url must be string",
    })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    })
    .optional(),
  is_takaful: z.boolean().optional(),
});

export type CourierSchemaType = z.infer<typeof CourierSchema>;
