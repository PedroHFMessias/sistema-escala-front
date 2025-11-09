import { NextFunction, Request, Response } from 'express';

import { UserType } from '@prisma/client';

import { prisma } from '../config/prisma';
import { mapReportToResponse } from '../utils/mappers';
import { reportTypeToPrisma } from '../utils/statusMapper';
import { generateReportSchema } from '../validators/reportValidator';

const reportsInclude = {
  generatedBy: true,
};

export const listReports = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await prisma.report.findMany({
      include: reportsInclude,
      orderBy: { generatedAt: 'desc' },
    });

    res.json({ success: true, data: reports.map(mapReportToResponse) });
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = generateReportSchema.parse(req.body);

    const startDate = new Date(payload.dateRange.start);
    const endDate = new Date(payload.dateRange.end);

    if (startDate > endDate) {
      return res.status(400).json({ success: false, message: 'Período inválido' });
    }

    const coordinator = await prisma.user.findUnique({ where: { id: payload.generatedBy } });

    if (!coordinator || coordinator.userType !== UserType.COORDINATOR) {
      return res.status(400).json({ success: false, message: 'Apenas coordenadores podem gerar relatórios' });
    }

    let data: unknown;

    switch (payload.type) {
      case 'schedule-summary':
        data = await buildScheduleSummary(startDate, endDate);
        break;
      case 'volunteer-status':
        data = await buildVolunteerStatusReport(startDate, endDate);
        break;
      case 'ministry-report':
        data = await buildMinistryReport(startDate, endDate);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Tipo de relatório inválido' });
    }

    const report = await prisma.report.create({
      data: {
        type: reportTypeToPrisma[payload.type],
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
        data,
        generatedById: payload.generatedBy,
      },
      include: reportsInclude,
    });

    res.status(201).json({ success: true, data: mapReportToResponse(report) });
  } catch (error) {
    next(error);
  }
};

const buildScheduleSummary = async (startDate: Date, endDate: Date) => {
  const schedules = await prisma.schedule.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    include: {
      ministry: true,
      volunteers: true,
    },
  });

  const totalSchedules = schedules.length;

  const byMinistry = schedules.reduce<Record<string, { ministryName: string; total: number }>>(
    (accumulator, schedule) => {
      const ministryId = schedule.ministryId;
      const ministryName = schedule.ministry.name;
      if (!accumulator[ministryId]) {
        accumulator[ministryId] = { ministryName, total: 0 };
      }
      accumulator[ministryId].total += 1;
      return accumulator;
    },
    {},
  );

  const volunteerAssignments = schedules.reduce((total, schedule) => total + schedule.volunteers.length, 0);

  return {
    totalSchedules,
    volunteerAssignments,
    ministries: Object.entries(byMinistry).map(([id, info]) => ({
      ministryId: id,
      ministryName: info.ministryName,
      schedules: info.total,
    })),
  };
};

const buildVolunteerStatusReport = async (startDate: Date, endDate: Date) => {
  const volunteers = await prisma.scheduleVolunteer.findMany({
    where: {
      schedule: {
        date: { gte: startDate, lte: endDate },
      },
    },
    include: {
      volunteer: true,
    },
  });

  const grouped = volunteers.reduce<Record<
    string,
    {
      volunteerName: string;
      pending: number;
      confirmed: number;
      requestedChange: number;
    }
  >>((accumulator, current) => {
    const existing = accumulator[current.volunteerId];
    if (!existing) {
      accumulator[current.volunteerId] = {
        volunteerName: current.volunteer.name,
        pending: 0,
        confirmed: 0,
        requestedChange: 0,
      };
    }

    const record = accumulator[current.volunteerId];

    switch (current.status) {
      case 'PENDING':
        record.pending += 1;
        break;
      case 'CONFIRMED':
        record.confirmed += 1;
        break;
      case 'TRADE_REQUESTED':
        record.requestedChange += 1;
        break;
      default:
        break;
    }

    return accumulator;
  }, {});

  return Object.entries(grouped).map(([volunteerId, info]) => ({
    volunteerId,
    volunteerName: info.volunteerName,
    pending: info.pending,
    confirmed: info.confirmed,
    requestedChange: info.requestedChange,
  }));
};

const buildMinistryReport = async (startDate: Date, endDate: Date) => {
  const ministries = await prisma.ministry.findMany({
    include: {
      volunteers: true,
      schedules: {
        where: { date: { gte: startDate, lte: endDate } },
        include: { volunteers: true },
      },
    },
  });

  return ministries.map((ministry) => ({
    ministryId: ministry.id,
    name: ministry.name,
    description: ministry.description,
    totalVolunteers: ministry.volunteers.length,
    schedules: ministry.schedules.map((schedule) => ({
      scheduleId: schedule.id,
      date: schedule.date,
      time: schedule.time,
      volunteers: schedule.volunteers.length,
    })),
  }));
};
