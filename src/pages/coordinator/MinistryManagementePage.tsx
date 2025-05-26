import {theme} from '../../styles/theme';
export const MinistryManagementPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600', 
          color: theme.colors.text.primary,
          marginBottom: '0.5rem'
        }}>
          Gerenciamento de Ministérios
        </h1>
        <p style={{ 
          color: theme.colors.text.secondary,
          marginBottom: '2rem'
        }}>
          Cadastre e gerencie os ministérios da paróquia
        </p>
        
        <div className="card">
          <p style={{ color: theme.colors.text.secondary }}>
            Funcionalidade de gerenciamento de ministérios será implementada aqui
          </p>
        </div>
      </div>
    </div>
  );
};