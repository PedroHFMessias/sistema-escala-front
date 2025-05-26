// src/pages/auth/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, UserPlus } from 'lucide-react';
import { theme } from '../../styles/theme';
import { ChurchIcon } from '../../components/ui/ChurchIcon';

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'coordinator' | 'volunteer';
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'volunteer'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Formatação especial para telefone
    if (name === 'phone') {
      const formattedPhone = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpa o erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 11) {
      const match = numbers.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
      if (match) {
        let formatted = '';
        if (match[1]) formatted += `(${match[1]}`;
        if (match[1] && match[1].length === 2) formatted += ') ';
        if (match[2]) formatted += match[2];
        if (match[3]) formatted += `-${match[3]}`;
        return formatted;
      }
    }
    return value;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação do email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação do telefone
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato: (11) 99999-9999';
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validação da confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simula chamada de API
    setTimeout(() => {
      setIsLoading(false);
      // Mock registration - em produção fazer chamada real para API
      console.log('Cadastro realizado:', formData);
      alert(`Cadastro realizado com sucesso!\nNome: ${formData.name}\nTipo: ${formData.userType}`);
      navigate('/login');
    }, 2000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${theme.colors.primary[500]}15, ${theme.colors.secondary[500]}10)`,
        zIndex: 0
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.colors.secondary[500]}25, transparent)`,
          filter: 'blur(50px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.colors.primary[500]}20, transparent)`,
          filter: 'blur(70px)'
        }}></div>
      </div>

      {/* Centered Register Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4rem',
        maxWidth: '1200px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Left Side - Branding */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: theme.colors.primary[500],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem auto',
            boxShadow: theme.shadows.lg
          }}>
            <ChurchIcon size={40} color="white" />
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: theme.colors.primary[600],
            marginBottom: '1rem',
            lineHeight: '1.2'
          }}>
            Junte-se à nossa
          </h1>
          
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: '600',
            color: theme.colors.secondary[600],
            marginBottom: '1.5rem'
          }}>
            Comunidade de Fé
          </h2>
          
          <p style={{
            fontSize: '1.125rem',
            color: theme.colors.text.secondary,
            lineHeight: '1.6',
            marginBottom: '2rem',
            maxWidth: '400px'
          }}>
            Crie sua conta para participar ativamente das atividades da Paróquia Santana. 
            Seja parte da nossa família espiritual.
          </p>
          
          <div style={{
            padding: '1.5rem',
            backgroundColor: `${theme.colors.secondary[50]}`,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.secondary[200]}`,
            maxWidth: '350px'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: theme.colors.text.primary,
              marginBottom: '1rem'
            }}>
              O que você pode fazer:
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.success[500]
                }}></div>
                <span style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                  Visualizar escalas e horários
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.primary[500]
                }}></div>
                <span style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                  Confirmar participação nas atividades
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.secondary[500]
                }}></div>
                <span style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                  Solicitar trocas quando necessário
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.warning[500]
                }}></div>
                <span style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                  Acompanhar histórico de participações
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '450px'
        }}>
          <div style={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius['2xl'],
            padding: '3rem',
            boxShadow: theme.shadows.lg,
            border: `1px solid ${theme.colors.border}`,
            width: '100%',
            position: 'relative'
          }}>
            {/* Form Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.875rem',
                fontWeight: '600',
                color: theme.colors.text.primary,
                marginBottom: '0.5rem'
              }}>
                Criar Conta
              </h3>
              <p style={{
                color: theme.colors.text.secondary,
                fontSize: '1rem'
              }}>
                Preencha os dados para se cadastrar
              </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* User Type Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.text.primary,
                  marginBottom: '0.5rem'
                }}>
                  Tipo de Usuário
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out',
                    backgroundColor: theme.colors.white,
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary[500];
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.colors.border;
                  }}
                >
                  <option value="volunteer">🙏 Voluntário</option>
                  <option value="coordinator">👑 Coordenador</option>
                </select>
              </div>

              {/* Name Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.text.primary,
                  marginBottom: '0.5rem'
                }}>
                  Nome Completo
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.colors.text.secondary
                  }}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 3rem',
                      border: `1px solid ${errors.name ? theme.colors.danger[500] : theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease-in-out',
                      backgroundColor: theme.colors.white
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary[500];
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.name ? theme.colors.danger[500] : theme.colors.border;
                    }}
                  />
                </div>
                {errors.name && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.danger[500],
                    marginTop: '0.25rem'
                  }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.text.primary,
                  marginBottom: '0.5rem'
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.colors.text.secondary
                  }}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 3rem',
                      border: `1px solid ${errors.email ? theme.colors.danger[500] : theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease-in-out',
                      backgroundColor: theme.colors.white
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary[500];
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.email ? theme.colors.danger[500] : theme.colors.border;
                    }}
                  />
                </div>
                {errors.email && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.danger[500],
                    marginTop: '0.25rem'
                  }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.text.primary,
                  marginBottom: '0.5rem'
                }}>
                  Telefone
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.colors.text.secondary
                  }}>
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 3rem',
                      border: `1px solid ${errors.phone ? theme.colors.danger[500] : theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease-in-out',
                      backgroundColor: theme.colors.white
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary[500];
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.phone ? theme.colors.danger[500] : theme.colors.border;
                    }}
                  />
                </div>
                {errors.phone && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.danger[500],
                    marginTop: '0.25rem'
                  }}>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.text.primary,
                  marginBottom: '0.5rem'
                }}>
                  Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.colors.text.secondary
                  }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Sua senha"
                    style={{
                      width: '100%',
                      padding: '0.75rem 3rem 0.75rem 3rem',
                      border: `1px solid ${errors.password ? theme.colors.danger[500] : theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease-in-out',
                      backgroundColor: theme.colors.white
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary[500];
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.password ? theme.colors.danger[500] : theme.colors.border;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: theme.colors.text.secondary
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.danger[500],
                    marginTop: '0.25rem'
                  }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: theme.colors.text.primary,
                  marginBottom: '0.5rem'
                }}>
                  Confirmar Senha
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: theme.colors.text.secondary
                  }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirme sua senha"
                    style={{
                      width: '100%',
                      padding: '0.75rem 3rem 0.75rem 3rem',
                      border: `1px solid ${errors.confirmPassword ? theme.colors.danger[500] : theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease-in-out',
                      backgroundColor: theme.colors.white
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = theme.colors.primary[500];
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.confirmPassword ? theme.colors.danger[500] : theme.colors.border;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: theme.colors.text.secondary
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: theme.colors.danger[500],
                    marginTop: '0.25rem'
                  }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: isLoading ? theme.colors.gray[400] : theme.colors.primary[500],
                  color: theme.colors.white,
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = theme.colors.primary[600];
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = theme.colors.primary[500];
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Criar Conta
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '2rem',
              padding: '1rem',
              backgroundColor: theme.colors.gray[50],
              borderRadius: theme.borderRadius.md
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: theme.colors.text.secondary,
                marginBottom: '0.5rem'
              }}>
                Já tem uma conta?
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.primary[600],
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}
              >
                <ArrowLeft size={16} />
                Fazer login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Animation CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 1024px) {
          .register-container {
            flex-direction: column !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};