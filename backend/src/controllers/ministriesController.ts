import { NextFunction, Request, Response } from 'express';

import { ScheduleStatus, TradeRequestStatus } from '@prisma/client';

import { prisma } from '../config/prisma';
import { mapMinistryToResponse } from '../utils/mappers';
import { createMinistrySchema, updateMinistrySchema } from '../validators/ministryValidator';

export const listMinistries = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const ministries = await prisma.ministry.findMany({
      include: { volunteers: true },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: ministries.map(mapMinistryToResponse) });
  } catch (error) {
    next(error);
  }
};

type MinistryScheduleSummary = {
  id: string;
  date: Date;
  time: string;
  totalVolunteers: number;
  statusCount: Record<'pending' | 'confirmed' | 'tradeRequested', number>;
  pendingTradeRequests: number;
};

type MinistryOverview = {
  totalSchedules: number;
  totalVolunteersAssigned: number;
  pendingConfirmations: number;
  pendingTradeRequests: number;
};

const getScheduleSummary = (schedule: {
  id: string;
  date: Date;
  time: string;
  volunteers: {
    status: ScheduleStatus;
  }[];
  tradeRequests: {
    status: TradeRequestStatus;
  }[];
}): MinistryScheduleSummary => {
  const statusCount = schedule.volunteers.reduce<
    Record<'pending' | 'confirmed' | 'tradeRequested', number>
  >(
    (accumulator, current) => {
      if (current.status === ScheduleStatus.PENDING) {
        accumulator.pending += 1;
      } else if (current.status === ScheduleStatus.CONFIRMED) {
        accumulator.confirmed += 1;
      } else if (current.status === ScheduleStatus.TRADE_REQUESTED) {
        accumulator.tradeRequested += 1;
      }

      return accumulator;
    },
    { pending: 0, confirmed: 0, tradeRequested: 0 }
  );

  const pendingTradeRequests = schedule.tradeRequests.filter(
    (request) => request.status === TradeRequestStatus.PENDING
  ).length;

  return {
    id: schedule.id,
    date: schedule.date,
    time: schedule.time,
    totalVolunteers: schedule.volunteers.length,
    statusCount,
    pendingTradeRequests,
  };
};

const buildOverview = (summaries: MinistryScheduleSummary[]): MinistryOverview =>
  summaries.reduce<MinistryOverview>(
    (totals, summary) => ({
      totalSchedules: totals.totalSchedules + 1,
      totalVolunteersAssigned: totals.totalVolunteersAssigned + summary.totalVolunteers,
      pendingConfirmations: totals.pendingConfirmations + summary.statusCount.pending,
      pendingTradeRequests: totals.pendingTradeRequests + summary.pendingTradeRequests,
    }),
    {
      totalSchedules: 0,
      totalVolunteersAssigned: 0,
      pendingConfirmations: 0,
      pendingTradeRequests: 0,
    }
  );

export const getMinistry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ministry = await prisma.ministry.findUnique({
      where: { id: req.params.id },
      include: {
        volunteers: true,
        schedules: {
          include: {
            volunteers: true,
            tradeRequests: true,
          },
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!ministry) {
      return res.status(404).json({ success: false, message: 'Ministério não encontrado' });
    }

    const scheduleSummaries = ministry.schedules.map((schedule) =>
      getScheduleSummary(schedule)
    );
    const overview = buildOverview(scheduleSummaries);

    res.json({
      success: true,
      data: {
        ...mapMinistryToResponse(ministry),
        overview: {
          totalSchedules: overview.totalSchedules,
          totalVolunteersAssigned: overview.totalVolunteersAssigned,
          pendingConfirmations: overview.pendingConfirmations,
          pendingTradeRequests: overview.pendingTradeRequests,
        },
        schedules: scheduleSummaries,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createMinistry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createMinistrySchema.parse(req.body);

    const ministry = await prisma.ministry.create({
      data: payload,
      include: { volunteers: true },
    });

    res.status(201).json({ success: true, data: mapMinistryToResponse(ministry) });
  } catch (error) {
    next(error);
  }
};

export const updateMinistry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updateMinistrySchema.parse(req.body);

    const ministry = await prisma.ministry.update({
      where: { id: req.params.id },
      data: payload,
      include: { volunteers: true },
    });

    res.json({ success: true, data: mapMinistryToResponse(ministry) });
  } catch (error) {
    next(error);
  }
};

export const deleteMinistry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.ministry.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
