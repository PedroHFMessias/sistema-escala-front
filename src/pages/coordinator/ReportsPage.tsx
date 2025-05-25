// src/pages/coordinator/ReportsPage.tsx
import {theme} from '../../styles/theme';
export const ReportsPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600', 
          color: theme.colors.text.primary,
          marginBottom: '0.5rem'
        }}>
          Relatórios
        </h1>
        <p style={{ 
          color: theme.colors.text.secondary,
          marginBottom: '2rem'
        }}>
          Visualize relatórios e estatísticas das escalas
        </p>
        
        <div className="card">
          <p style={{ color: theme.colors.text.secondary }}>
            Funcionalidade de relatórios será implementada aqui
          </p>
        </div>
      </div>
    </div>
  );
};