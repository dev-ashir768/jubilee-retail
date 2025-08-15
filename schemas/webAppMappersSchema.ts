import { z } from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

const securityCheckError = "Input contains forbidden characters or code.";

export const WebAppMappersSchema = z.object({
  parent_sku: z
    .string()
    .min(1, "Parent SKU is required.")
    .refine((val) => !forbiddenCodeRegex.test(val), securityCheckError),
    
  child_sku: z
    .string()
    .min(1, "Child SKU is required.")
    .refine((val) => !forbiddenCodeRegex.test(val), securityCheckError),

  plan_id: z.number().int().positive("Plan ID must be a positive number."),
  product_id: z.number().int().positive("Product ID must be a positive number."),
  option_id: z.number().int().positive("Option ID must be a positive number."),
});

// This type is inferred from the schema and remains correct
export type WebAppMappersSchemaType = z.infer<typeof WebAppMappersSchema>;