import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zipCode: z.string().min(8).max(9),
});

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  cpf: z.string().min(11),
  rg: z.string().min(5),
  password: z.string().min(6),
  userType: z.enum(['coordinator', 'volunteer']),
  address: addressSchema.optional(),
  ministries: z.array(z.string()).default([]),
});

export const updateUserSchema = createUserSchema.partial();
