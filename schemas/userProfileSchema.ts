import z from "zod";

const forbiddenCodeRegex =
  /(<\?php|<script|function\s*\(|SELECT\s+|INSERT\s+|UPDATE\s+|DELETE\s+|DROP\s+|CREATE\s+|EXEC\s+|system\(|eval\(|require\(|import\s+|export\s+)/i;

export const UserProfileSchema = z.object({
  username: z
    .string({ invalid_type_error: "Username must be a string" })
    .trim()
    .min(3, { message: "Username cannot be empty" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  fullname: z
    .string({ invalid_type_error: "Fullname must be a string" })
    .trim()
    .min(3, { message: "Fullname cannot be empty" })
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  phone: z
    .string({ invalid_type_error: "Phone must be a string" })
    .regex(/^03[0-4][0-9]{8}$/, {
      message: "Phone must be a valid Pakistani phone number",
    })
    .trim()
    .refine((val) => !forbiddenCodeRegex.test(val), {
      message: "Invalid input: Code-like content is not allowed",
    }),
  image: z.string().optional(),
  is_active: z.boolean({ required_error: "Status is required" }),
  is_locked: z.boolean({ required_error: "Lock Status is required" }),
  user_id: z.number({ message: "User Id is required" }),
  user_type: z.enum(["api_user", "dashboard_user"], {
    required_error: "User type is required",
  }),
  password: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z.union([
        z.literal(""),
        z
          .string()
          .min(1, { message: "Password is required" })
      ])
    ),
});

export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;
