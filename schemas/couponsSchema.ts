import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

const CouponsSchema = z
  .object({
    code: z
      .string({ message: "Code must be a string" })
      .min(3, "Code must be at least 3 characters long")
      .max(20, "Code cannot be more than 20 characters")
      .trim()
      .transform((val) => val.toUpperCase())
      .refine((val) => !forbiddenCodeRegex.test(val), {
        message: "Code contains forbidden patterns",
      }),
    campaign_name: z
      .string({ message: "Campaign Name must be a string" })
      .min(1, "Campaign name is required")
      .max(50, "Campaign name cannot be more than 50 characters")
      .trim()
      .refine((val) => !forbiddenCodeRegex.test(val), {
        message: "Campaign name contains forbidden code patterns",
      }),
    expiry_date: z.coerce
      .date({
        errorMap: () => ({ message: "Please enter a valid expiry date" }),
      })
      .transform((date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }),
    application_date: z.coerce
      .date({
        errorMap: () => ({ message: "Please enter a valid application date" }),
      })
      .transform((date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }),
    quantity: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce
        .number()
        .int("Quantity must be a whole number")
        .min(0, "Quantity cannot be negative")
    ),
    discount_value: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce
        .number({
          required_error: "Discount value is required",
          invalid_type_error: "Discount must be a number",
        })
        .min(0, "Discount value cannot be negative")
        .transform((val) => val.toFixed(2))
    ),
    use_per_customer: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z.coerce
        .number({
          required_error: "Uses per customer is required",
          invalid_type_error: "Uses must be a number",
        })
        .int("Uses per customer must be a whole number")
        .min(1, "A customer must be able to use it at least once")
    ),
    coupon_type: z.enum(["percentage", "flat", "other"], {
      errorMap: () => ({ message: "Please select a valid coupon type" }),
    }),
    products: z.array(z.number().int().positive()).optional(),
  })
  .refine((data) => data.expiry_date > data.application_date, {
    message: "Expiry date must be after the application date",
    path: ["expiry_date"],
  });

export default CouponsSchema;
export type CouponsSchemaType = z.infer<typeof CouponsSchema>;
