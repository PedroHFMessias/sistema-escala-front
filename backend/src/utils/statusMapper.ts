import {
  ReportType,
  ScheduleStatus,
  TradeRequestStatus,
  UserType,
} from '@prisma/client';

type FrontScheduleStatus = 'pendente' | 'confirmado' | 'troca-solicitada';
type FrontTradeRequestStatus = 'pending' | 'approved' | 'rejected';
type FrontReportType = 'schedule-summary' | 'volunteer-status' | 'ministry-report';
type FrontUserType = 'coordinator' | 'volunteer';

export const scheduleStatusToPrisma: Record<FrontScheduleStatus, ScheduleStatus> = {
  pendente: ScheduleStatus.PENDING,
  confirmado: ScheduleStatus.CONFIRMED,
  'troca-solicitada': ScheduleStatus.TRADE_REQUESTED,
};

export const scheduleStatusToFront: Record<ScheduleStatus, FrontScheduleStatus> = {
  [ScheduleStatus.PENDING]: 'pendente',
  [ScheduleStatus.CONFIRMED]: 'confirmado',
  [ScheduleStatus.TRADE_REQUESTED]: 'troca-solicitada',
};

export const tradeStatusToPrisma: Record<FrontTradeRequestStatus, TradeRequestStatus> = {
  pending: TradeRequestStatus.PENDING,
  approved: TradeRequestStatus.APPROVED,
  rejected: TradeRequestStatus.REJECTED,
};

export const tradeStatusToFront: Record<TradeRequestStatus, FrontTradeRequestStatus> = {
  [TradeRequestStatus.PENDING]: 'pending',
  [TradeRequestStatus.APPROVED]: 'approved',
  [TradeRequestStatus.REJECTED]: 'rejected',
};

export const reportTypeToPrisma: Record<FrontReportType, ReportType> = {
  'schedule-summary': ReportType.SCHEDULE_SUMMARY,
  'volunteer-status': ReportType.VOLUNTEER_STATUS,
  'ministry-report': ReportType.MINISTRY_REPORT,
};

export const reportTypeToFront: Record<ReportType, FrontReportType> = {
  [ReportType.SCHEDULE_SUMMARY]: 'schedule-summary',
  [ReportType.VOLUNTEER_STATUS]: 'volunteer-status',
  [ReportType.MINISTRY_REPORT]: 'ministry-report',
};

export const userTypeToPrisma: Record<FrontUserType, UserType> = {
  coordinator: UserType.COORDINATOR,
  volunteer: UserType.VOLUNTEER,
};

export const userTypeToFront: Record<UserType, FrontUserType> = {
  [UserType.COORDINATOR]: 'coordinator',
  [UserType.VOLUNTEER]: 'volunteer',
};
