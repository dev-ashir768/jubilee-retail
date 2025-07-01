import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const branchSchema = z.object({
  branchName: z
    .string({
      required_error: "Branch name is required",
    })
    .trim()
    .min(2, { message: "Branch name should be at least 2 characters" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  managerFirstName: z
    .string({
      required_error: "Manager first name is required",
    })
    .trim()
    .min(2, { message: "First name should be at least 2 characters" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  managerLastName: z
    .string({
      required_error: "Manager last name is required",
    })
    .trim()
    .min(2, { message: "Last name should be at least 2 characters" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  username: z
    .string({
      required_error: "Username is required",
    })
    .trim()
    .min(3, { message: "Username should be at least 3 characters" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
});

export type BranchSchemaType = z.infer<typeof branchSchema>;