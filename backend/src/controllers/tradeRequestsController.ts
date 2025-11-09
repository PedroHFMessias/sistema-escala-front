import { NextFunction, Request, Response } from 'express';

import { prisma } from '../config/prisma';
import { mapTradeRequestToResponse } from '../utils/mappers';
import { tradeStatusToPrisma } from '../utils/statusMapper';
import {
  createTradeRequestSchema,
  updateTradeRequestStatusSchema,
} from '../validators/tradeRequestValidator';

const tradeRequestInclude = {
  schedule: {
    include: {
      ministry: true,
    },
  },
  requestingVolunteer: true,
  respondedBy: true,
};

export const listTradeRequests = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tradeRequests = await prisma.tradeRequest.findMany({
      include: tradeRequestInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: tradeRequests.map(mapTradeRequestToResponse) });
  } catch (error) {
    next(error);
  }
};

export const createTradeRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createTradeRequestSchema.parse(req.body);

    const [schedule, volunteer, assignment] = await Promise.all([
      prisma.schedule.findUnique({ where: { id: payload.scheduleId } }),
      prisma.user.findUnique({ where: { id: payload.requestingVolunteerId } }),
      prisma.scheduleVolunteer.findUnique({
        where: {
          scheduleId_volunteerId: {
            scheduleId: payload.scheduleId,
            volunteerId: payload.requestingVolunteerId,
          },
        },
      }),
    ]);

    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Escala não encontrada' });
    }

    if (!assignment) {
      return res.status(400).json({ success: false, message: 'Voluntário não está escalado para esta escala' });
    }

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Voluntário não encontrado' });
    }

    const tradeRequest = await prisma.tradeRequest.create({
      data: {
        scheduleId: payload.scheduleId,
        requestingVolunteerId: payload.requestingVolunteerId,
        reason: payload.reason,
      },
      include: tradeRequestInclude,
    });

    res.status(201).json({ success: true, data: mapTradeRequestToResponse(tradeRequest) });
  } catch (error) {
    next(error);
  }
};

export const updateTradeRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = updateTradeRequestStatusSchema.parse(req.body);

    const coordinator = await prisma.user.findUnique({ where: { id: payload.respondedBy } });

    if (!coordinator) {
      return res.status(404).json({ success: false, message: 'Coordenador não encontrado' });
    }

    if (coordinator.userType !== 'COORDINATOR') {
      return res.status(400).json({ success: false, message: 'Apenas coordenadores podem responder trocas' });
    }

    const tradeRequest = await prisma.tradeRequest.update({
      where: { id: req.params.id },
      data: {
        status: tradeStatusToPrisma[payload.status],
        respondedById: payload.respondedBy,
        respondedAt: new Date(),
      },
      include: tradeRequestInclude,
    });

    res.json({ success: true, data: mapTradeRequestToResponse(tradeRequest) });
  } catch (error) {
    next(error);
  }
};
