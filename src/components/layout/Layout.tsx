import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  UserCheck, 
  Settings, 
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { ChurchIcon } from '../ui/ChurchIcon';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  role: 'coordinator' | 'volunteer' | 'both';
  subItems?: NavigationItem[];
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data - será substituído por contexto real
  const userRole: 'coordinator' | 'volunteer' = 'coordinator';
  const userName = 'João Silva';
  const userEmail = 'joao.silva@paroquiasantana.com.br';

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Início',
      icon: <Home size={20} />,
      path: '/',
      role: 'both'
    },
    {
      id: 'cadastros',
      label: 'Cadastros',
      icon: <Users size={20} />,
      path: '/cadastros',
      role: 'coordinator',
      subItems: [
        {
          id: 'ministerios',
          label: 'Ministérios',
          icon: <Users size={16} />,
          path: '/cadastros/ministerios',
          role: 'coordinator'
        },
        {
          id: 'membros',
          label: 'Membros',
          icon: <UserCheck size={16} />,
          path: '/cadastros/membros',
          role: 'coordinator'
        }
      ]
    },
    {
      id: 'escalas',
      label: 'Escalas',
      icon: <Calendar size={20} />,
      path: '/escalas',
      role: 'both',
      subItems: userRole === 'coordinator' ? [
        {
          id: 'gerenciar-escalas',
          label: 'Gerenciar Escalas',
          icon: <Settings size={16} />,
          path: '/escalas/gerenciar',
          role: 'coordinator'
        },
        {
          id: 'visualizar-escalas',
          label: 'Visualizar Escalas',
          icon: <Calendar size={16} />,
          path: '/escalas',
          role: 'both'
        }
      ] : [
        {
          id: 'minhas-escalas',
          label: 'Minhas Escalas',
          icon: <Calendar size={16} />,
          path: '/minhas-escalas',
          role: 'volunteer'
        },
        {
          id: 'visualizar-escalas',
          label: 'Todas as Escalas',
          icon: <Calendar size={16} />,
          path: '/escalas',
          role: 'both'
        }
      ]
    },
    {
      id: 'confirmacoes',
      label: 'Confirmações',
      icon: <UserCheck size={20} />,
      path: '/confirmacoes',
      role: 'volunteer'
    }
  ];

  const filteredNavigation = navigationItems.filter(
    item => item.role === 'both' || item.role === userRole
  );

  const toggleSubmenu = (itemId: string) => {
    setExpandedMenus(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActiveRoute = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-280px',
        width: '280px',
        height: '100vh',
        backgroundColor: theme.colors.white,
        borderRight: `1px solid ${theme.colors.border}`,
        transition: 'left 0.3s ease-in-out',
        zIndex: 1000,
        boxShadow: sidebarOpen ? theme.shadows.lg : 'none'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '1rem',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div 
            onClick={() => {
              navigate('/');
              setSidebarOpen(false);
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ChurchIcon size={18} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: theme.colors.primary[600],
                marginBottom: '0.25rem'
              }}>
                Sistema de Escalas
              </h2>
              <p style={{
                fontSize: '0.75rem',
                color: theme.colors.text.secondary
              }}>
                Paróquia Santana
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              padding: '0.5rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: theme.colors.text.secondary
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1rem 0', flex: 1, overflowY: 'auto' }}>
          {filteredNavigation.map((item) => (
            <div key={item.id}>
              <div
                onClick={() => {
                  if (item.subItems) {
                    toggleSubmenu(item.id);
                  } else {
                    handleNavigation(item.path);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  margin: '0.25rem 0.5rem',
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  color: isActiveRoute(item.path) ? theme.colors.primary[600] : theme.colors.text.primary,
                  backgroundColor: isActiveRoute(item.path) ? theme.colors.primary[50] : 'transparent',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  if (!isActiveRoute(item.path)) {
                    e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute(item.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.icon}
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {item.label}
                  </span>
                </div>
                {item.subItems && (
                  <ChevronDown 
                    size={16} 
                    style={{
                      transform: expandedMenus.includes(item.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease-in-out'
                    }}
                  />
                )}
              </div>

              {/* Submenu */}
              {item.subItems && expandedMenus.includes(item.id) && (
                <div style={{ paddingLeft: '1rem' }}>
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      onClick={() => handleNavigation(subItem.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 1rem',
                        margin: '0.25rem 0.5rem',
                        borderRadius: theme.borderRadius.md,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: isActiveRoute(subItem.path) ? theme.colors.primary[600] : theme.colors.text.secondary,
                        backgroundColor: isActiveRoute(subItem.path) ? theme.colors.primary[50] : 'transparent',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActiveRoute(subItem.path)) {
                          e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActiveRoute(subItem.path)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {subItem.icon}
                      <span>{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div style={{
          padding: '1rem',
          borderTop: `1px solid ${theme.colors.border}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: theme.colors.primary[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.white,
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              {userName.charAt(0)}
            </div>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.text.primary
              }}>
                {userName}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: theme.colors.text.secondary
              }}>
                {userRole === 'coordinator' ? 'Coordenador' : 'Voluntário'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              backgroundColor: 'transparent',
              color: theme.colors.text.secondary,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.gray[50];
              e.currentTarget.style.color = theme.colors.text.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.text.secondary;
            }}
          >
            <LogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%'
      }}>
        {/* Top Bar */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderBottom: `1px solid ${theme.colors.border}`,
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: theme.shadows.sm,
          position: 'relative',
          width: '100%'
        }}>
          {/* Left Side - Menu Button and Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                padding: '0.5rem',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: theme.colors.text.secondary,
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.gray[50];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Menu size={20} />
            </button>

            <div 
              onClick={() => navigate('/')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: theme.colors.primary[500],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ChurchIcon size={16} color="white" />
              </div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: theme.colors.text.primary
              }}>
                Sistema de Escalas - Paróquia Santana
              </h1>
            </div>
          </div>

          {/* Right Side - User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.primary[500],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.white,
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: theme.colors.text.primary
                  }}>
                    {userName}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.text.secondary
                  }}>
                    {userRole === 'coordinator' ? 'Coordenador' : 'Voluntário'}
                  </p>
                </div>
                <ChevronDown size={16} color={theme.colors.text.secondary} />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '200px',
                  backgroundColor: theme.colors.white,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: theme.shadows.lg,
                  zIndex: 1000
                }}>
                  <div style={{
                    padding: '1rem',
                    borderBottom: `1px solid ${theme.colors.border}`
                  }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.text.primary
                    }}>
                      {userName}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: theme.colors.text.secondary
                    }}>
                      {userEmail}
                    </p>
                  </div>

                  <div style={{ padding: '0.5rem' }}>
                    <button
                      onClick={() => console.log('Perfil')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: theme.colors.text.primary,
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <User size={16} />
                      <span>Meu Perfil</span>
                    </button>

                    <button
                      onClick={() => console.log('Configurações')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: theme.colors.text.primary,
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Settings size={16} />
                      <span>Configurações</span>
                    </button>
                  </div>

                  <div style={{
                    padding: '0.5rem',
                    borderTop: `1px solid ${theme.colors.border}`
                  }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: '0.5rem',
                        border: 'none',
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: theme.colors.danger[600],
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.danger[50];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Dropdowns Overlay */}
      {userMenuOpen && (
        <div
          onClick={() => setUserMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 500
          }}
        />
      )}
    </div>
  );
};