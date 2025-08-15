import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

const ProductSchema = z.object({
  product_name: z
    .string()
    .min(1, "Product name is required")
    .max(50, "Product name cannot be longer than 50 characters")
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Product Name contains forbidden code patterns",
    }),

  product_type: z
    .string()
    .min(6, "Product type must be at least 6 characters long")
    .max(10, "Product type cannot be longer than 10 characters")
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Product Type contains forbidden code patterns",
    }),

  product_category_id: z
    .number({
      required_error: "Product category ID is required",
      invalid_type_error: "Product category ID must be a number",
    })
    .min(1, "Product category ID must be a positive number"),
});

export default ProductSchema;
export type ProductSchemaType = z.infer<typeof ProductSchema>;
