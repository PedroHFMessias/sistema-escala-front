import { z } from 'zod';

export const createMinistrySchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  color: z.string().regex(/^#?[0-9A-Fa-f]{6}$/),
});

export const updateMinistrySchema = createMinistrySchema.partial();
