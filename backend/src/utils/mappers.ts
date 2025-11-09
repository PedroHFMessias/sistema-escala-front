import {
  Address,
  Ministry,
  Report,
  Schedule,
  ScheduleStatus,
  ScheduleVolunteer,
  TradeRequest,
  User,
  VolunteerMinistry,
} from '@prisma/client';

import { reportTypeToFront, scheduleStatusToFront, tradeStatusToFront, userTypeToFront } from './statusMapper';

export type UserWithRelations = User & {
  address?: Address | null;
  ministries?: (VolunteerMinistry & { ministry: Ministry })[];
};

export const mapUserToResponse = (user: UserWithRelations) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  cpf: user.cpf,
  rg: user.rg,
  userType: userTypeToFront[user.userType],
  address: user.address
    ? {
        street: user.address.street,
        number: user.address.number,
        complement: user.address.complement ?? undefined,
        neighborhood: user.address.neighborhood,
        city: user.address.city,
        state: user.address.state,
        zipCode: user.address.zipCode,
      }
    : null,
  ministries: user.ministries?.map((item) => item.ministryId) ?? [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export type MinistryWithRelations = Ministry & {
  volunteers?: VolunteerMinistry[];
};

export const mapMinistryToResponse = (ministry: MinistryWithRelations) => ({
  id: ministry.id,
  name: ministry.name,
  description: ministry.description,
  color: ministry.color,
  createdAt: ministry.createdAt,
  updatedAt: ministry.updatedAt,
  volunteers: ministry.volunteers?.map((volunteer) => volunteer.volunteerId) ?? [],
});

export type ScheduleWithRelations = Schedule & {
  ministry: Ministry;
  createdBy: User;
  volunteers: (ScheduleVolunteer & { volunteer: User })[];
};

export const mapScheduleToResponse = (schedule: ScheduleWithRelations) => ({
  id: schedule.id,
  date: schedule.date,
  time: schedule.time,
  ministry: schedule.ministryId,
  volunteers: schedule.volunteers.map((volunteer) => ({
    volunteerId: volunteer.volunteerId,
    volunteerName: volunteer.volunteer.name,
    status: scheduleStatusToFront[volunteer.status as ScheduleStatus],
    confirmedAt: volunteer.confirmedAt ?? undefined,
    requestedChangeAt: volunteer.requestedChangeAt ?? undefined,
    requestedChangeReason: volunteer.requestedChangeReason ?? undefined,
  })),
  createdBy: schedule.createdById,
  createdAt: schedule.createdAt,
  updatedAt: schedule.updatedAt,
});

export type TradeRequestWithRelations = TradeRequest & {
  schedule: Schedule & { ministry: Ministry };
  requestingVolunteer: User;
  respondedBy?: User | null;
};

export const mapTradeRequestToResponse = (tradeRequest: TradeRequestWithRelations) => ({
  id: tradeRequest.id,
  scheduleId: tradeRequest.scheduleId,
  requestingVolunteerId: tradeRequest.requestingVolunteerId,
  requestingVolunteerName: tradeRequest.requestingVolunteer.name,
  reason: tradeRequest.reason,
  status: tradeStatusToFront[tradeRequest.status],
  createdAt: tradeRequest.createdAt,
  respondedAt: tradeRequest.respondedAt ?? undefined,
  respondedBy: tradeRequest.respondedById ?? undefined,
});

export type ReportWithRelations = Report & {
  generatedBy: User;
};

export const mapReportToResponse = (report: ReportWithRelations) => ({
  id: report.id,
  type: reportTypeToFront[report.type],
  dateRange: {
    start: report.dateRangeStart,
    end: report.dateRangeEnd,
  },
  data: report.data,
  generatedBy: report.generatedById,
  generatedAt: report.generatedAt,
});
