import { z } from 'zod';

export const generateReportSchema = z.object({
  type: z.enum(['schedule-summary', 'volunteer-status', 'ministry-report']),
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
  generatedBy: z.string().uuid(),
});
