import { z } from 'zod';

export const createTradeRequestSchema = z.object({
  scheduleId: z.string().uuid(),
  requestingVolunteerId: z.string().uuid(),
  reason: z.string().min(5),
});

export const updateTradeRequestStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
  respondedBy: z.string().uuid(),
});
