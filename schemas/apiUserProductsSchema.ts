import z from "zod";

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

export type ApiUserProductsSchemaType = z.infer<
  typeof ApiUserProductsSchema
>;
