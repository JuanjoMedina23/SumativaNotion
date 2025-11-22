import { z } from "zod";

/* ------------------ LOGIN-------------------------- */
export const loginSchema = z.object({
  email: z
    .string()
    .email("El correo no es válido")
    .describe("icon:Mail"), // 👈 metadato de icono

  password: z
    .string()
    .min(6, "La contraseña debe tener mínimo 6 caracteres")
    .describe("icon:Lock"),
});


/* ---------------REGISTRO------------------------------------------------ */
export const registerSchema = z
  .object({
    email: z
      .string()
      .email("El correo no es válido")
      .describe("icon:Mail"),

    password: z
      .string()
      .min(6, "La contraseña debe tener mínimo 6 caracteres")
      .describe("icon:Lock"),

    confirmPassword: z
      .string()
      .describe("icon:ShieldCheck"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });


/* ----------------------------NOTAS------------------------ */
export const noteSchema = z.object({
  title: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(100, "El título no puede tener más de 100 caracteres")
    .describe("icon:Type"),

  content: z
    .string()
    .min(1, "La nota no puede estar vacía")
    .describe("icon:FileText"),

  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
});


/* ------ ACTUALIZAR PERFIL---------- */
export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .optional()
    .describe("icon:User"),

  photoURL: z
    .string()
    .url("La foto debe ser una URL válida")
    .optional()
    .describe("icon:Image"),
});


export const schemas = {
  login: loginSchema,
  register: registerSchema,
  note: noteSchema,
  profile: profileUpdateSchema,
};
