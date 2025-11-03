import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const ApiUserProductsSchema = z.object({
  api_user_id: z
    .number({
      message: "API User ID is required.",
      invalid_type_error: "API User ID must be a number.",
    })
    .int("API User ID must be an integer.")
    .positive("API User ID must be a positive number."),
  product_id: z
    .array(
      z
        .number({
          message: "Product ID is required.",
          invalid_type_error: "Product ID must be a number.",
        })
        .int("Product ID must be an integer.")
        .positive("Product ID must be a positive number.")
    )
    .nonempty({
      message: "You must provide at least one product ID.",
    }),
});

export type ApiUserProductsSchemaType = z.infer<typeof ApiUserProductsSchema>;

export const ApiUserProductsFilterSchema = z.object({
  api_user_id: z
    .array(z.coerce.number())
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Api User contains forbidden code patterns",
    }),
});

export type ApiUserProductsFilterSchemaType = z.infer<
  typeof ApiUserProductsFilterSchema
>;
