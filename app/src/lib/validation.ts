import { z } from "zod";
import { ages, sizes } from "../data/models";
const required = (name: string) =>
  z.string().trim().min(1, `Informe ${name.toLowerCase()}.`);
export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido.").trim().toLowerCase(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});
export const orgSchema = loginSchema.extend({
  name: required("Nome"),
  phone: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine(
      (s) => /^55\d{10,11}$/.test(s),
      "Informe o WhatsApp com 55, DDD e número.",
    ),
  cep: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => /^\d{8}$/.test(s), "O CEP deve ter 8 dígitos."),
  state: z.enum(
    [
      "AC",
      "AL",
      "AP",
      "AM",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MT",
      "MS",
      "MG",
      "PA",
      "PB",
      "PR",
      "PE",
      "PI",
      "RJ",
      "RN",
      "RS",
      "RO",
      "RR",
      "SC",
      "SP",
      "SE",
      "TO",
    ],
    "Escolha uma UF válida.",
  ),
  city: required("Cidade"),
  street: required("Rua"),
  number: required("Número"),
});
export const petSchema = z.object({
  name: required("Nome"),
  description: z
    .string()
    .trim()
    .min(15, "Descreva o pet com pelo menos 15 caracteres."),
  breed: required("Raça"),
  age: z.enum(ages),
  size: z.enum(sizes),
  species: z.enum(["Cão", "Gato"]),
});
export function errorsFrom(error: z.ZodError) {
  return Object.fromEntries(
    error.issues.map((i) => [String(i.path[0]), i.message]),
  );
}
