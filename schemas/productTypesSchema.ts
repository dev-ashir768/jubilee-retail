import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

const ProductTypesSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name cannot be longer than 50 characters")
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Name contains forbidden code patterns",
    }),

  days: z
    .number({
      required_error: "Days is required",
      invalid_type_error: "Days must be a number",
    })
    .min(1, "Days must be a positive number"),
});

export default ProductTypesSchema;
export type ProductTypesSchemaType = z.infer<typeof ProductTypesSchema>;
