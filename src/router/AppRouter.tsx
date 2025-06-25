// src/router/AppRouter.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout'
import { HomePage } from '../pages/home/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Coordinator Pages
import { MinistryManagementPage } from '../pages/coordinator/MinistryManagementePage';
import { MemberManagementPage } from '../pages/coordinator/MemberManagementPage';
import { ReportsPage } from '../pages/coordinator/ReportsPage'; // Adicionar ReportsPage

// Volunteer Pages
import { VolunteerSchedulePage } from '../pages/volunteer/VolunteerSchedulePage';
import { VolunteerConfirmationPage } from '../pages/volunteer/VolunteerConfirmationPage';

// Shared Pages
import { ScheduleManagementPage } from '../pages/shared/ScheduleManagementPage';
import { ScheduleViewPage } from '../pages/shared/ScheduleViewPage'; // Adicionar ScheduleViewPage

import { useAuth } from '../context/AuthContext'; // Importar useAuth


// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'coordinator' | 'volunteer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth(); // Obter do contexto

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redireciona para a home se o papel não corresponder, ou para login se não autenticado.
    // A HomePage se adaptará ao userRole.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  // Removido 'const { userRole } = useAuth();' pois não é usado diretamente aqui
  // A lógica de userRole no Layout e ProtectedRoute é independente desta linha

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes with Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Coordinator Routes */}
        <Route path="/cadastros" element={
          <ProtectedRoute requiredRole="coordinator">
            <Layout>
              <Navigate to="/cadastros/ministerios" replace />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/cadastros/ministerios" element={
          <ProtectedRoute requiredRole="coordinator">
            <Layout>
              <MinistryManagementPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/cadastros/membros" element={
          <ProtectedRoute requiredRole="coordinator">
            <Layout>
              <MemberManagementPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/relatorios" element={
          <ProtectedRoute requiredRole="coordinator">
            <Layout>
              <ReportsPage />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Schedule Management - Coordinator */}
        <Route path="/escalas/gerenciar" element={
          <ProtectedRoute requiredRole="coordinator">
            <Layout>
              <ScheduleManagementPage />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Volunteer Routes */}
        <Route path="/minhas-escalas" element={
          <ProtectedRoute requiredRole="volunteer">
            <Layout>
              <VolunteerSchedulePage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/confirmacoes" element={
          <ProtectedRoute requiredRole="volunteer">
            <Layout>
              <VolunteerConfirmationPage />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Shared Routes - Schedule Viewing (available for both, check Layout for display logic) */}
        <Route path="/escalas" element={
          <ProtectedRoute>
            <Layout>
              <ScheduleViewPage />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};