import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

const securityCheckError = "Input contains forbidden characters or code.";

export const ProductOptionsSchema = z
  .object({
    product_id: z.number().min(0, "Project is required"),
    option_name: z
      .string()
      .min(3, "Option name must be at least 3 characters long.")
      .refine((val) => !forbiddenCodeRegex.test(val), securityCheckError),
    plan_code: z
      .string()
      .refine(
        (val) => !val || !forbiddenCodeRegex.test(val),
        securityCheckError
      )
      .optional()
      .nullable(),
    price: z.number().int().positive("Price must be a positive number."),
    duration_type: z.enum(["day", "month", "year"], {
      errorMap: () => ({
        message: "Duration type must be 'day', 'month', or 'year'.",
      }),
    }),
    duration: z.number().int().positive("Duration must be a positive number."),
    start_limit: z.number().min(0, "Start limit cannot be negative."),
    end_limit: z.number().min(0, "End limit cannot be negative."),
    start_limit_mother: z
      .number()
      .min(0, "Mother's start limit cannot be negative.")
      .optional(),
    end_limit_mother: z
      .number()
      .min(0, "Mother's end limit cannot be negative.")
      .optional(),
    stamp_duty: z.number().min(0, "Stamp duty cannot be negative."),
    sales_tax: z.number().min(0, "Sales tax cannot be negative."),
    federal_insurance_fee: z
      .number()
      .min(0, "Federal insurance fee cannot be negative."),
    gross_premium: z.number().min(0, "Gross premium cannot be negative."),
    subtotal: z.number().min(0, "Subtotal cannot be negative."),
    administrative_subcharges: z
      .number()
      .min(0, "Administrative subcharges cannot be negative."),
  })
  .refine((data) => data.end_limit >= data.start_limit, {
    message: "End limit must be greater than or equal to start limit",
    path: ["end_limit"],
  });

export type ProductOptionsSchemaType = z.infer<typeof ProductOptionsSchema>;
