import {theme} from '../../styles/theme';
export const VolunteerConfirmationPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600', 
          color: theme.colors.text.primary,
          marginBottom: '0.5rem'
        }}>
          Confirmações
        </h1>
        <p style={{ 
          color: theme.colors.text.secondary,
          marginBottom: '2rem'
        }}>
          Confirme sua participação ou solicite trocas de escalas
        </p>
        
        <div className="card">
          <p style={{ color: theme.colors.text.secondary }}>
            Funcionalidade de confirmações e trocas será implementada aqui
          </p>
        </div>
      </div>
    </div>
  );
};
