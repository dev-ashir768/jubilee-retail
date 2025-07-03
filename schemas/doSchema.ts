import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const doSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .trim()
    .min(3, { message: "Title should be at least 3 characters" })
    .max(100, { message: "Title should not exceed 100 characters" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  description: z
    .string({
      required_error: "Description is required",
    })
    .trim()
    .min(10, { message: "Description should be at least 10 characters" })
    .max(500, { message: "Description should not exceed 500 characters" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  priority: z
    .enum(["low", "medium", "high"], {
      invalid_type_error: "Priority must be low, medium, or high",
    }),
  status: z
    .enum(["pending", "in_progress", "completed"], {
      invalid_type_error: "Status must be pending, in_progress, or completed",
    }),
  due_date: z
    .string({
      required_error: "Due date is required",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Due date must be in YYYY-MM-DD format",
    }),
  assigned_to: z
    .number({
      required_error: "Assigned user is required",
      invalid_type_error: "Assigned user must be a number",
    })
    .min(1, { message: "Please select a valid user" }),
});

export type DoSchemaType = z.infer<typeof doSchema>;