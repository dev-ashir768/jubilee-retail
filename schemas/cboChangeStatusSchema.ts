import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const CBOStatusSchema = z.object({
    cbo_status: z
    .string()
    .min(1, { message: "CBO Status is required" })
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "CBO Status contains forbidden code patterns",
    }),
});

export type CBOStatusSchemaType = z.infer<typeof CBOStatusSchema>;
