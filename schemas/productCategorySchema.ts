import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

const ProductCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50)
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Name contains forbidden code patterns",
    }),

  igis_product_code: z
    .string()
    .min(6, "Igis Product Code is required")
    .max(10, "Igis Product Code is required")
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Name contains forbidden code patterns",
    }),

  department_id: z
    .number({
      required_error: "Department ID is required",
      invalid_type_error: "Department ID must be a number",
    })
    .min(1, "Department ID must be a positive number"),
});

export default ProductCategorySchema;
export type ProductCategorySchemaType = z.infer<typeof ProductCategorySchema>;
