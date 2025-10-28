import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const PolicyStatusSchema = z.object({
  branch_id: z.coerce
    .number()
    .min(1, { message: "Branch is required" })
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Branch contains forbidden code patterns",
    }),
  agent_id: z.coerce
    .number()
    .min(1, { message: "Agent is required" })
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Agent contains forbidden code patterns",
    }),
  client_id: z.coerce
    .number()
    .min(1, { message: "Client is required" })
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Client contains forbidden code patterns",
    }),
    status: z
    .string()
    .min(1, { message: "Policy Status is required" })
    .refine((val) => !forbiddenCodeRegex.test(String(val)), {
      message: "Policy Status contains forbidden code patterns",
    }),
});

export type PolicyStatusSchemaType = z.infer<typeof PolicyStatusSchema>;
