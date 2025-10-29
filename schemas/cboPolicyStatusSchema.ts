import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const CBOPolicyStatusSchema = z.object({
    status: z
    .string()
    .min(1, { message: "CBO Policy Status is required" })
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Policy Status contains forbidden code patterns",
    }),
});

export type CBOCBOPolicyStatusSchemaType = z.infer<typeof CBOPolicyStatusSchema>;
