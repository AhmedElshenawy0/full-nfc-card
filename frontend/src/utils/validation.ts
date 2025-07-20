import z from "zod";

export const signUpValidation = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
      invalid_type_error: "First name should be of type string",
    })
    .min(3, "First name must be at least 3 characters"),
  lastName: z
    .string({
      required_error: "Last name is required",
      invalid_type_error: "Last name should be of type string",
    })
    .min(3, "Last name must be at least 3 characters"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password should be of type string",
    })
    .min(6, "Password must be at least 6 characters"),
  phone: z.string({
    required_error: "Phone is required",
    invalid_type_error: "Phone should be of type string",
  }),
  city: z.string({
    required_error: "City is required",
    invalid_type_error: "City should be of type string",
  }),
  birthday: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val)),
  job: z.string({
    required_error: "Date is required",
    invalid_type_error: "Date should be of type string",
  }),
});

export const signInValidation = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email("Invalid email address"),
  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password should be of type string",
    })
    .min(6, "Password must be at least 6 characters"),
});
