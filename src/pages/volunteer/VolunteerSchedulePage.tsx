// src/pages/volunteer/VolunteerSchedulePage.tsx
import {theme} from '../../styles/theme';
export const VolunteerSchedulePage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600', 
          color: theme.colors.text.primary,
          marginBottom: '0.5rem'
        }}>
          Minhas Escalas
        </h1>
        <p style={{ 
          color: theme.colors.text.secondary,
          marginBottom: '2rem'
        }}>
          Visualize suas escalas e horários de participação
        </p>
        
        <div className="card">
          <p style={{ color: theme.colors.text.secondary }}>
            Funcionalidade de visualização de escalas do voluntário será implementada aqui
          </p>
        </div>
      </div>
    </div>
  );
};