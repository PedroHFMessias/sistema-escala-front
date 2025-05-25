// src/pages/coordinator/MemberManagementPage.tsx
import {theme} from '../../styles/theme';
export const MemberManagementPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div className="container">
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600', 
          color: theme.colors.text.primary,
          marginBottom: '0.5rem'
        }}>
          Gerenciamento de Membros
        </h1>
        <p style={{ 
          color: theme.colors.text.secondary,
          marginBottom: '2rem'
        }}>
          Cadastre e vincule voluntários aos ministérios
        </p>
        
        <div className="card">
          <p style={{ color: theme.colors.text.secondary }}>
            Funcionalidade de gerenciamento de membros será implementada aqui
          </p>
        </div>
      </div>
    </div>
  );
};