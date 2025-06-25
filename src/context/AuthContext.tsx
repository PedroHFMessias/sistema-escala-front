// src/context/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // Importação corrigida de ReactNode

// Definir os tipos para o contexto
interface AuthContextType {
  userRole: 'coordinator' | 'volunteer' | null;
  login: (role: 'coordinator' | 'volunteer') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Criar o contexto com valores padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Criar um hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Componente provedor de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<'coordinator' | 'volunteer' | null>(null);

  const login = (role: 'coordinator' | 'volunteer') => {
    setUserRole(role);
    console.log(`Usuário logado como: ${role}`);
  };

  const logout = () => {
    setUserRole(null);
    console.log('Usuário deslogado');
  };

  const isAuthenticated = userRole !== null;

  const value = {
    userRole,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};