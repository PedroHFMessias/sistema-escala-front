import{theme} from '../../styles/theme';
export const ScheduleViewPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600', 
          color: theme.colors.text.primary,
          marginBottom: '0.5rem'
        }}>
          Visualizar Escalas
        </h1>
        <p style={{ 
          color: theme.colors.text.secondary,
          marginBottom: '2rem'
        }}>
          Visualize todas as escalas programadas
        </p>
        
        <div className="card">
          <p style={{ color: theme.colors.text.secondary }}>
            Funcionalidade de visualização geral de escalas será implementada aqui
          </p>
        </div>
      </div>
    </div>
  );
};