// src/pages/auth/RegisterPage.tsx
import {theme} from '../../styles/theme'
export const RegisterPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: theme.colors.background 
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: theme.colors.primary[600],
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Cadastro - Sistema de Escalas
        </h1>
        <p style={{ 
          color: theme.colors.text.secondary,
          textAlign: 'center'
        }}>
          Página de cadastro será implementada em breve
        </p>
      </div>
    </div>
  );
};