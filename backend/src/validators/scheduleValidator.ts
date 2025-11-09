import { z } from 'zod';

export const createScheduleSchema = z.object({
  date: z.string().datetime().or(z.date()).transform((value) => new Date(value)),
  time: z.string().min(1),
  ministryId: z.string().uuid(),
  volunteerIds: z.array(z.string().uuid()).min(1),
  createdBy: z.string().uuid(),
});

export const updateScheduleSchema = z.object({
  date: z.string().datetime().or(z.date()).transform((value) => new Date(value)).optional(),
  time: z.string().optional(),
  ministryId: z.string().uuid().optional(),
  volunteerIds: z.array(z.string().uuid()).min(1).optional(),
});

export const updateScheduleStatusSchema = z
  .object({
    status: z.enum(['pendente', 'confirmado', 'troca-solicitada']),
    requestedChangeReason: z.string().min(5).optional(),
  })
  .refine(
    (data) =>
      data.status !== 'troca-solicitada' || (data.requestedChangeReason && data.requestedChangeReason.length > 0),
    {
      message: 'Motivo é obrigatório quando o status é troca-solicitada',
      path: ['requestedChangeReason'],
    }
  );
