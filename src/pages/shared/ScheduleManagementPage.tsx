// src/pages/coordinator/ScheduleManagementPage.tsx
import {theme} from '../../styles/theme';
export const ScheduleManagementPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600', 
          color: theme.colors.text.primary,
          marginBottom: '0.5rem'
        }}>
          Gerenciamento de Escalas
        </h1>
        <p style={{ 
          color: theme.colors.text.secondary,
          marginBottom: '2rem'
        }}>
          Crie e gerencie as escalas dos voluntários para as missas
        </p>
        
        <div className="card">
          <p style={{ color: theme.colors.text.secondary }}>
            Funcionalidade de gerenciamento de escalas será implementada aqui
          </p>
        </div>
      </div>
    </div>
  );
};