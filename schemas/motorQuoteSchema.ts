import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const statusEnum = z.enum(["pending", "cancelled", "approved"]);

export const MotorQuoteFilterSchema = z.object({
  status: z
    .array(statusEnum)
    .nullable()
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Status contains forbidden code patterns",
    }),
});

export type MotorQuoteFilterSchemaType = z.infer<typeof MotorQuoteFilterSchema>;
