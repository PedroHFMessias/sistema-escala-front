// src/pages/home/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, UserCheck, Settings, ChevronDown } from 'lucide-react';
import { theme } from '../../styles/theme';
import { ChurchIcon } from '../../components/ui/ChurchIcon';

interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  userType: 'coordinator' | 'volunteer' | 'both';
  hasSubmenu?: boolean;
  submenuItems?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  
  // Mock do tipo de usuário - será implementado com autenticação posteriormente
  const userType: 'coordinator' | 'volunteer' = 'coordinator';

  const cadastrosSubmenu: SubMenuItem[] = [
    {
      id: 'ministerios',
      title: 'Ministérios',
      description: 'Gerenciar ministérios da paróquia',
      icon: <Users size={20} />,
      path: '/cadastros/ministerios'
    },
    {
      id: 'membros',
      title: 'Membros',
      description: 'Gerenciar voluntários',
      icon: <UserCheck size={20} />,
      path: '/cadastros/membros'
    }
  ];

  const escalasSubmenu: SubMenuItem[] = userType === 'coordinator' ? [
    {
      id: 'gerenciar-escalas',
      title: 'Gerenciar Escalas',
      description: 'Criar e editar escalas',
      icon: <Settings size={20} />,
      path: '/escalas/gerenciar'
    },
    {
      id: 'visualizar-escalas',
      title: 'Visualizar Escalas',
      description: 'Ver todas as escalas',
      icon: <Calendar size={20} />,
      path: '/escalas'
    }
  ] : [
    {
      id: 'minhas-escalas',
      title: 'Minhas Escalas',
      description: 'Ver minhas escalas',
      icon: <Calendar size={20} />,
      path: '/minhas-escalas'
    },
    {
      id: 'visualizar-escalas',
      title: 'Todas as Escalas',
      description: 'Ver escalas da paróquia',
      icon: <Calendar size={20} />,
      path: '/escalas'
    }
  ];

  const menuOptions: MenuOption[] = [
    {
      id: 'cadastros',
      title: 'Cadastros',
      description: 'Gerenciar ministérios e membros',
      icon: <Users size={32} />,
      color: theme.colors.primary[500],
      userType: 'coordinator',
      hasSubmenu: true,
      submenuItems: cadastrosSubmenu
    },
    {
      id: 'escalas',
      title: 'Escalas',
      description: userType === 'coordinator' ? 'Criar e gerenciar escalas das missas' : 'Visualizar e confirmar suas escalas',
      icon: <Calendar size={32} />,
      color: theme.colors.secondary[500],
      userType: 'both',
      hasSubmenu: true,
      submenuItems: escalasSubmenu
    },
    {
      id: 'confirmacoes',
      title: 'Confirmações',
      description: 'Confirmar participação ou solicitar trocas',
      icon: <UserCheck size={32} />,
      color: theme.colors.success[500],
      userType: 'volunteer'
    }
  ];

  const filteredOptions = menuOptions.filter(
    option => option.userType === 'both' || option.userType === userType
  );

  const handleOptionClick = (option: MenuOption) => {
    if (option.hasSubmenu) {
      setOpenSubmenu(openSubmenu === option.id ? null : option.id);
    } else {
      switch (option.id) {
        case 'confirmacoes':
          navigate('/confirmacoes');
          break;
        default:
          console.log(`Navegando para: ${option.id}`);
      }
    }
  };

  const handleSubmenuClick = (path: string) => {
    navigate(path);
    setOpenSubmenu(null);
  };

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {/* Header Section */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '600', 
            color: theme.colors.text.primary,
            marginBottom: '1rem'
          }}>
            Bem-vindo ao Sistema de Escalas
          </h2>
          <p style={{ 
            color: theme.colors.text.secondary,
            fontSize: '1.125rem',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Gerencie as escalas da Paróquia Santana de forma simples e eficiente. Selecione uma opção abaixo para começar.
          </p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '4rem',
          alignItems: 'start'
        }}>
          
          {/* Left Side - Menu Grid */}
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: userType === 'coordinator' ? 'repeat(2, 1fr)' : '1fr',
              gap: '1.5rem',
              position: 'relative'
            }}>
              {filteredOptions.map((option) => (
                <div key={option.id} style={{ position: 'relative' }}>
                  <div
                    onClick={() => handleOptionClick(option)}
                    style={{
                      backgroundColor: theme.colors.white,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.xl,
                      padding: '2rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      boxShadow: theme.shadows.sm,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden',
                      minHeight: '200px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = theme.shadows.lg;
                      e.currentTarget.style.borderColor = option.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = theme.shadows.sm;
                      e.currentTarget.style.borderColor = theme.colors.border;
                    }}
                  >
                    {/* Background Pattern */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '80px',
                      height: '80px',
                      background: `linear-gradient(135deg, ${option.color}08, ${option.color}15)`,
                      borderRadius: '0 0 0 80px'
                    }}></div>
                    
                    {/* Icon */}
                    <div 
                      style={{
                        padding: '1.5rem',
                        borderRadius: '20px',
                        backgroundColor: `${option.color}15`,
                        color: option.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      {option.icon}
                    </div>
                    
                    {/* Content */}
                    <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: theme.colors.text.primary,
                        marginBottom: '0.75rem'
                      }}>
                        {option.title}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: theme.colors.text.secondary,
                        lineHeight: '1.5'
                      }}>
                        {option.description}
                      </p>
                    </div>

                    {/* Arrow indicator ou Submenu indicator */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: `${option.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {option.hasSubmenu ? (
                        <ChevronDown 
                          size={16} 
                          color={option.color}
                          style={{
                            transform: openSubmenu === option.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease-in-out'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRight: `2px solid ${option.color}`,
                          borderBottom: `2px solid ${option.color}`,
                          transform: 'rotate(-45deg)',
                          marginLeft: '2px'
                        }}></div>
                      )}
                    </div>
                  </div>

                  {/* Submenu Dropdown */}
                  {option.hasSubmenu && openSubmenu === option.id && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '0.5rem',
                      backgroundColor: theme.colors.white,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadows.lg,
                      zIndex: 1000,
                      overflow: 'hidden'
                    }}>
                      {option.submenuItems?.map((subItem, index) => (
                        <div
                          key={subItem.id}
                          onClick={() => handleSubmenuClick(subItem.path)}
                          style={{
                            padding: '1rem',
                            cursor: 'pointer',
                            borderBottom: index < option.submenuItems!.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
                            transition: 'background-color 0.2s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            backgroundColor: `${option.color}15`,
                            color: option.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {subItem.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: theme.colors.text.primary,
                              marginBottom: '0.25rem'
                            }}>
                              {subItem.title}
                            </h4>
                            <p style={{
                              fontSize: '0.75rem',
                              color: theme.colors.text.secondary,
                              lineHeight: '1.4'
                            }}>
                              {subItem.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Info Panel */}
          <div>
            {/* Quick Stats */}
            <div style={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.borderRadius.xl,
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: theme.shadows.sm,
              border: `1px solid ${theme.colors.border}`
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: theme.colors.text.primary,
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                Resumo Rápido
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userType === 'coordinator' ? (
                  <>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: theme.colors.primary[50],
                      borderRadius: theme.borderRadius.lg,
                      border: `1px solid ${theme.colors.primary[200]}`
                    }}>
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        backgroundColor: theme.colors.primary[500],
                        color: 'white'
                      }}>
                        <Users size={20} />
                      </div>
                      <div>
                        <p style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: theme.colors.primary[600],
                          marginBottom: '0.25rem'
                        }}>
                          24
                        </p>
                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Voluntários Ativos
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: theme.colors.secondary[50],
                      borderRadius: theme.borderRadius.lg,
                      border: `1px solid ${theme.colors.secondary[200]}`
                    }}>
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        backgroundColor: theme.colors.secondary[500],
                        color: 'white'
                      }}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: theme.colors.secondary[600],
                          marginBottom: '0.25rem'
                        }}>
                          7
                        </p>
                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Escalas Pendentes
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: theme.colors.success[50],
                      borderRadius: theme.borderRadius.lg,
                      border: `1px solid ${theme.colors.success[200]}`
                    }}>
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        backgroundColor: theme.colors.success[500],
                        color: 'white'
                      }}>
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <p style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: theme.colors.success[600],
                          marginBottom: '0.25rem'
                        }}>
                          18
                        </p>
                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Confirmações Hoje
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: theme.colors.primary[50],
                      borderRadius: theme.borderRadius.lg,
                      border: `1px solid ${theme.colors.primary[200]}`
                    }}>
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        backgroundColor: theme.colors.primary[500],
                        color: 'white'
                      }}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: theme.colors.primary[600],
                          marginBottom: '0.25rem'
                        }}>
                          3
                        </p>
                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Próximas Escalas
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '1rem',
                      backgroundColor: theme.colors.warning[50],
                      borderRadius: theme.borderRadius.lg,
                      border: `1px solid ${theme.colors.warning[200]}`
                    }}>
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        backgroundColor: theme.colors.warning[500],
                        color: 'white'
                      }}>
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <p style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: theme.colors.warning[600],
                          marginBottom: '0.25rem'
                        }}>
                          1
                        </p>
                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Pendente Confirmação
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.borderRadius.xl,
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: theme.shadows.sm,
              border: `1px solid ${theme.colors.border}`
            }}>
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: theme.colors.text.primary,
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {userType === 'coordinator' ? 'Atividades Recentes' : 'Próximas Atividades'}
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {userType === 'coordinator' ? (
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: theme.colors.gray[50],
                      borderRadius: theme.borderRadius.md
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.success[500]
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: '500',
                          color: theme.colors.text.primary 
                        }}>
                          Maria Silva confirmou
                        </p>
                        <p style={{ 
                          fontSize: '0.7rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Há 15 min
                        </p>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: theme.colors.gray[50],
                      borderRadius: theme.borderRadius.md
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.warning[500]
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: '500',
                          color: theme.colors.text.primary 
                        }}>
                          João solicitou troca
                        </p>
                        <p style={{ 
                          fontSize: '0.7rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Há 1 hora
                        </p>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: theme.colors.gray[50],
                      borderRadius: theme.borderRadius.md
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.primary[500]
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: '500',
                          color: theme.colors.text.primary 
                        }}>
                          Escala criada
                        </p>
                        <p style={{ 
                          fontSize: '0.7rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Há 3 horas
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: theme.colors.primary[50],
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.primary[200]}`
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.primary[500]
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: '500',
                          color: theme.colors.text.primary 
                        }}>
                          Missa 19h - Dom
                        </p>
                        <p style={{ 
                          fontSize: '0.7rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Em 2 dias
                        </p>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: theme.colors.warning[50],
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.warning[200]}`
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: theme.colors.warning[500]
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: '500',
                          color: theme.colors.text.primary 
                        }}>
                          Missa 8h - Dom
                        </p>
                        <p style={{ 
                          fontSize: '0.7rem', 
                          color: theme.colors.text.secondary 
                        }}>
                          Confirmar
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Church Info */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: `${theme.colors.secondary[500]}10`,
              borderRadius: theme.borderRadius.xl,
              border: `1px solid ${theme.colors.secondary[200]}`,
              textAlign: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.secondary[500],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ChurchIcon size={16} color="white" />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: theme.colors.text.primary
                }}>
                  Paróquia Santana
                </h3>
              </div>
              
              <p style={{
                fontSize: '0.8rem',
                color: theme.colors.text.secondary,
                lineHeight: '1.5',
                marginBottom: '1rem'
              }}>
                {userType === 'coordinator' 
                  ? 'Gerencie com eficiência todas as atividades da nossa comunidade.'
                  : 'Sua participação é essencial para nossa comunidade de fé.'
                }
              </p>
              
              <div style={{
                padding: '0.75rem',
                backgroundColor: theme.colors.white,
                borderRadius: theme.borderRadius.lg,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: theme.colors.text.secondary
              }}>
                <span>💡</span>
                <span>Use o menu lateral para navegação rápida</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para fechar submenu quando clicar fora */}
      {openSubmenu && (
        <div
          onClick={() => setOpenSubmenu(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
    </div>
  );
};