// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'coordinator' | 'volunteer';
  createdAt: Date;
  updatedAt: Date;
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Volunteer extends User {
  userType: 'volunteer';
  ministries: string[]; // IDs dos ministérios
}

export interface Coordinator extends User {
  userType: 'coordinator';
}

export interface Schedule {
  id: string;
  date: Date;
  time: string;
  ministry: string; // ID do ministério
  volunteers: ScheduleVolunteer[];
  createdBy: string; // ID do coordenador
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleVolunteer {
  volunteerId: string;
  volunteerName: string;
  status: 'pendente' | 'confirmado' | 'troca-solicitada';
  confirmedAt?: Date;
  requestedChangeAt?: Date;
  requestedChangeReason?: string;
}

export interface TradeRequest {
  id: string;
  scheduleId: string;
  requestingVolunteerId: string;
  requestingVolunteerName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  respondedAt?: Date;
  respondedBy?: string; // ID do coordenador
}

export interface Report {
  id: string;
  type: 'schedule-summary' | 'volunteer-status' | 'ministry-report';
  dateRange: {
    start: Date;
    end: Date;
  };
  data: any; // Será tipado específicamente para cada tipo de relatório
  generatedBy: string; // ID do coordenador
  generatedAt: Date;
}

// Tipos utilitários
export type UserType = 'coordinator' | 'volunteer';
export type ScheduleStatus = 'pendente' | 'confirmado' | 'troca-solicitada';
export type TradeRequestStatus = 'pending' | 'approved' | 'rejected';

// Interfaces para formulários
export interface CreateUserForm {
  name: string;
  email: string;
  phone: string;
  userType: UserType;
}

export interface CreateMinistryForm {
  name: string;
  description: string;
  color: string;
}

export interface CreateScheduleForm {
  date: Date;
  time: string;
  ministryId: string;
  volunteerIds: string[];
}

// Interfaces para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}