import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const UpdatePasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(1, { message: "Old Password is required" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  newPassword: z
    .string()
    .min(1, { message: "New Password is required" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
});

export type UpdatePasswordSchemaType = z.infer<typeof UpdatePasswordSchema>;
