import { NextFunction, Request, Response } from 'express';

import { UserType } from '@prisma/client';

import { prisma } from '../config/prisma';
import { mapScheduleToResponse } from '../utils/mappers';
import { scheduleStatusToPrisma } from '../utils/statusMapper';
import {
  createScheduleSchema,
  updateScheduleSchema,
  updateScheduleStatusSchema,
} from '../validators/scheduleValidator';

const scheduleInclude = {
  ministry: true,
  createdBy: true,
  volunteers: {
    include: {
      volunteer: true,
    },
  },
};

export const listSchedules = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const schedules = await prisma.schedule.findMany({
      include: scheduleInclude,
      orderBy: { date: 'desc' },
    });

    res.json({ success: true, data: schedules.map(mapScheduleToResponse) });
  } catch (error) {
    next(error);
  }
};

export const getSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id: req.params.id },
      include: scheduleInclude,
    });

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Escala não encontrada' });
    }

    res.json({ success: true, data: mapScheduleToResponse(schedule) });
  } catch (error) {
    next(error);
  }
};

export const createSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createScheduleSchema.parse(req.body);

    const [coordinator, volunteers, ministry] = await Promise.all([
      prisma.user.findUnique({ where: { id: payload.createdBy } }),
      prisma.user.findMany({
        where: { id: { in: payload.volunteerIds }, userType: UserType.VOLUNTEER },
      }),
      prisma.ministry.findUnique({ where: { id: payload.ministryId } }),
    ]);

    if (!ministry) {
      return res.status(404).json({ success: false, message: 'Ministério não encontrado' });
    }

    if (!coordinator || coordinator.userType !== UserType.COORDINATOR) {
      return res.status(400).json({ success: false, message: 'Coordenador inválido' });
    }

    if (volunteers.length !== payload.volunteerIds.length) {
      return res.status(400).json({ success: false, message: 'Lista de voluntários inválida' });
    }

    const schedule = await prisma.schedule.create({
      data: {
        date: payload.date,
        time: payload.time,
        ministryId: payload.ministryId,
        createdById: payload.createdBy,
        volunteers: {
          create: payload.volunteerIds.map((volunteerId) => ({ volunteerId })),
        },
      },
      include: scheduleInclude,
    });

    res.status(201).json({ success: true, data: mapScheduleToResponse(schedule) });
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = updateScheduleSchema.parse(req.body);

    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: req.params.id },
    });

    if (!existingSchedule) {
      return res.status(404).json({ success: false, message: 'Escala não encontrada' });
    }

    if (payload.volunteerIds) {
      const volunteers = await prisma.user.findMany({
        where: { id: { in: payload.volunteerIds }, userType: UserType.VOLUNTEER },
      });

      if (volunteers.length !== payload.volunteerIds.length) {
        return res.status(400).json({ success: false, message: 'Lista de voluntários inválida' });
      }
    }

    if (payload.ministryId) {
      const ministry = await prisma.ministry.findUnique({ where: { id: payload.ministryId } });
      if (!ministry) {
        return res.status(404).json({ success: false, message: 'Ministério não encontrado' });
      }
    }

    const schedule = await prisma.schedule.update({
      where: { id: req.params.id },
      data: {
        date: payload.date ?? undefined,
        time: payload.time,
        ministryId: payload.ministryId,
        volunteers: payload.volunteerIds
          ? {
              deleteMany: { scheduleId: req.params.id },
              create: payload.volunteerIds.map((volunteerId) => ({ volunteerId })),
            }
          : undefined,
      },
      include: scheduleInclude,
    });

    res.json({ success: true, data: mapScheduleToResponse(schedule) });
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.schedule.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateScheduleVolunteerStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = updateScheduleStatusSchema.parse(req.body);
    const { scheduleId, volunteerId } = req.params;

    await prisma.scheduleVolunteer.update({
      where: {
        scheduleId_volunteerId: {
          scheduleId,
          volunteerId,
        },
      },
      data: {
        status: scheduleStatusToPrisma[payload.status],
        confirmedAt: payload.status === 'confirmado' ? new Date() : null,
        requestedChangeAt: payload.status === 'troca-solicitada' ? new Date() : null,
        requestedChangeReason:
          payload.status === 'troca-solicitada' ? payload.requestedChangeReason ?? null : null,
      },
      include: {
        schedule: scheduleInclude,
      },
    });

    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: scheduleInclude,
    });

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Escala não encontrada' });
    }

    res.json({ success: true, data: mapScheduleToResponse(schedule) });
  } catch (error) {
    next(error);
  }
};
