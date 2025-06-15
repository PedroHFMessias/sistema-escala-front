// src/pages/coordinator/MemberManagementPage.tsx
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Users,
  X,
  Check,
  AlertCircle,
  UserPlus,
  Eye,
  EyeOff,
  CreditCard,
  MapPin,
  FileText
} from 'lucide-react';
import { theme } from '../../styles/theme';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  userType: 'coordinator' | 'volunteer';
  ministries: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface Ministry {
  id: string;
  name: string;
  color: string;
}

interface MemberForm {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg: string;
  address: {
    street: string;
    number: string;
    complement?: string; // Opcional no formulário também
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  password: string;
  userType: 'coordinator' | 'volunteer';
  ministries: string[];
}

export const MemberManagementPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'coordinator' | 'volunteer'>('all');
  const [filterMinistry, setFilterMinistry] = useState('all');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<MemberForm>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    rg: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    password: '',
    userType: 'volunteer',
    ministries: []
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - será substituído por dados da API
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria.silva@email.com',
      phone: '(11) 99999-1234',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      address: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      userType: 'volunteer',
      ministries: ['ministerio-1', 'ministerio-2'],
      status: 'active',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'João Santos',
      email: 'joao.santos@email.com',
      phone: '(11) 88888-5678',
      cpf: '987.654.321-00',
      rg: '98.765.432-1',
      address: {
        street: 'Av. Paulista',
        number: '1000',
        complement: '',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      },
      userType: 'coordinator',
      ministries: ['ministerio-1'],
      status: 'active',
      createdAt: new Date('2024-02-20')
    }
  ]);

  const ministries: Ministry[] = [
    { id: 'ministerio-1', name: 'Liturgia', color: theme.colors.primary[500] },
    { id: 'ministerio-2', name: 'Música', color: theme.colors.secondary[500] },
    { id: 'ministerio-3', name: 'Catequese', color: theme.colors.success[500] },
    { id: 'ministerio-4', name: 'Pastoral Jovem', color: theme.colors.warning[500] }
  ];

  const getMinistryName = (id: string) => {
    return ministries.find(m => m.id === id)?.name || 'Desconhecido';
  };

  const getMinistryColor = (id: string) => {
    return ministries.find(m => m.id === id)?.color || theme.colors.gray[500];
  };

  // Formatação de telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
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

  // Formatação de CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      const match = numbers.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
      if (match) {
        let formatted = match[1];
        if (match[2]) formatted += `.${match[2]}`;
        if (match[3]) formatted += `.${match[3]}`;
        if (match[4]) formatted += `-${match[4]}`;
        return formatted;
      }
    }
    return value;
  };

  // Formatação de RG
  const formatRG = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 9) {
      const match = numbers.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,1})$/);
      if (match) {
        let formatted = match[1];
        if (match[2]) formatted += `.${match[2]}`;
        if (match[3]) formatted += `.${match[3]}`;
        if (match[4]) formatted += `-${match[4]}`;
        return formatted;
      }
    }
    return value;
  };

  // Formatação de CEP
  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      const match = numbers.match(/^(\d{0,5})(\d{0,3})$/);
      if (match) {
        let formatted = match[1];
        if (match[2]) formatted += `-${match[2]}`;
        return formatted;
      }
    }
    return value;
  };

  // Validação de CPF
  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else if (name === 'cpf') {
      const formattedCPF = formatCPF(value);
      setFormData(prev => ({ ...prev, [name]: formattedCPF }));
    } else if (name === 'rg') {
      const formattedRG = formatRG(value);
      setFormData(prev => ({ ...prev, [name]: formattedRG }));
    } else if (name === 'zipCode') {
      const formattedZipCode = formatZipCode(value);
      setFormData(prev => ({ 
        ...prev, 
        address: { ...prev.address, zipCode: formattedZipCode }
      }));
    } else if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({ 
        ...prev, 
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMinistryToggle = (ministryId: string) => {
    setFormData(prev => ({
      ...prev,
      ministries: prev.ministries.includes(ministryId)
        ? prev.ministries.filter(id => id !== ministryId)
        : [...prev.ministries, ministryId]
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Formato: (11) 99999-9999';
    }

    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.rg) {
      newErrors.rg = 'RG é obrigatório';
    } else if (formData.rg.replace(/\D/g, '').length < 8) {
      newErrors.rg = 'RG deve ter pelo menos 8 dígitos';
    }

    // Validação do endereço
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Logradouro é obrigatório';
    }

    if (!formData.address.number.trim()) {
      newErrors['address.number'] = 'Número é obrigatório';
    }

    if (!formData.address.neighborhood.trim()) {
      newErrors['address.neighborhood'] = 'Bairro é obrigatório';
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'Cidade é obrigatória';
    }

    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'Estado é obrigatório';
    }

    if (!formData.address.zipCode) {
      newErrors['address.zipCode'] = 'CEP é obrigatório';
    } else if (!/^\d{5}-\d{3}$/.test(formData.address.zipCode)) {
      newErrors['address.zipCode'] = 'Formato: 12345-678';
    }

    if (!editingMember && !formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!editingMember && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.ministries.length === 0) {
      newErrors.ministries = 'Selecione pelo menos um ministério';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    setTimeout(() => {
      if (editingMember) {
        // Atualizar membro existente
        setMembers(prev => prev.map(member => 
          member.id === editingMember.id 
            ? { ...member, ...formData, id: editingMember.id, createdAt: member.createdAt, status: member.status }
            : member
        ));
      } else {
        // Criar novo membro
        const newMember: Member = {
          id: Date.now().toString(),
          ...formData,
          status: 'active',
          createdAt: new Date()
        };
        setMembers(prev => [...prev, newMember]);
      }
      
      resetForm();
      setIsLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      rg: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      password: '',
      userType: 'volunteer',
      ministries: []
    });
    setErrors({});
    setShowForm(false);
    setEditingMember(null);
    setShowPassword(false);
  };

  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      cpf: member.cpf,
      rg: member.rg,
      address: member.address,
      password: '',
      userType: member.userType,
      ministries: member.ministries
    });
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = (memberId: string) => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const toggleMemberStatus = (memberId: string) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.cpf.includes(searchTerm.replace(/\D/g, ''));
    
    const matchesType = filterType === 'all' || member.userType === filterType;
    
    const matchesMinistry = filterMinistry === 'all' || member.ministries.includes(filterMinistry);
    
    return matchesSearch && matchesType && matchesMinistry;
  });

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: theme.colors.background }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '1rem'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '600', 
                color: theme.colors.text.primary,
                marginBottom: '0.5rem'
              }}>
                Gerenciamento de Membros
              </h1>
              <p style={{ 
                color: theme.colors.text.secondary,
                fontSize: '1.125rem'
              }}>
                Cadastre e gerencie voluntários e coordenadores da paróquia
              </p>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: theme.colors.primary[500],
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.lg,
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: theme.shadows.sm
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary[600];
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary[500];
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = theme.shadows.sm;
              }}
            >
              <Plus size={18} />
              Novo Membro
            </button>
          </div>
          
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              backgroundColor: theme.colors.white,
              padding: '1.5rem',
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadows.sm
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.primary[100]
                }}>
                  <Users size={24} color={theme.colors.primary[600]} />
                </div>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.text.primary }}>
                    {members.filter(m => m.status === 'active').length}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                    Membros Ativos
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.colors.white,
              padding: '1.5rem',
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadows.sm
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.secondary[100]
                }}>
                  <User size={24} color={theme.colors.secondary[600]} />
                </div>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.text.primary }}>
                    {members.filter(m => m.userType === 'volunteer').length}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                    Voluntários
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.colors.white,
              padding: '1.5rem',
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadows.sm
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.success[100]
                }}>
                  <UserPlus size={24} color={theme.colors.success[600]} />
                </div>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.text.primary }}>
                    {members.filter(m => m.userType === 'coordinator').length}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                    Coordenadores
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: theme.colors.white,
              padding: '1.5rem',
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.shadows.sm
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.warning[100]
                }}>
                  <Calendar size={24} color={theme.colors.warning[600]} />
                </div>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: '700', color: theme.colors.text.primary }}>
                    {members.filter(m => {
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return m.createdAt > monthAgo;
                    }).length}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: theme.colors.text.secondary }}>
                    Novos (30 dias)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div style={{
          backgroundColor: theme.colors.white,
          padding: '1.5rem',
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          marginBottom: '2rem',
          boxShadow: theme.shadows.sm
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: '1rem',
            alignItems: 'end'
          }}>
            {/* Search */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.text.primary,
                marginBottom: '0.5rem'
              }}>
                Buscar Membros
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.colors.text.secondary
                }}>
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome, email ou CPF..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 3rem',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = theme.colors.primary[500];
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = theme.colors.border;
                  }}
                />
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.text.primary,
                marginBottom: '0.5rem'
              }}>
                Tipo
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'coordinator' | 'volunteer')}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: theme.colors.white,
                  cursor: 'pointer'
                }}
              >
                <option value="all">Todos</option>
                <option value="volunteer">Voluntários</option>
                <option value="coordinator">Coordenadores</option>
              </select>
            </div>

            {/* Filter by Ministry */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: theme.colors.text.primary,
                marginBottom: '0.5rem'
              }}>
                Ministério
              </label>
              <select
                value={filterMinistry}
                onChange={(e) => setFilterMinistry(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: '0.875rem',
                  outline: 'none',
                  backgroundColor: theme.colors.white,
                  cursor: 'pointer'
                }}
              >
                <option value="all">Todos</option>
                {ministries.map(ministry => (
                  <option key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Member Form Modal */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}>
            <div style={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.borderRadius.xl,
              padding: '2rem',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: theme.shadows.lg
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: theme.colors.text.primary
                }}>
                  {editingMember ? 'Editar Membro' : 'Novo Membro'}
                </h3>
                <button
                  onClick={resetForm}
                  style={{
                    padding: '0.5rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    borderRadius: theme.borderRadius.md,
                    color: theme.colors.text.secondary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.gray[100];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* User Type */}
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
                      backgroundColor: theme.colors.white,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="volunteer">🙏 Voluntário</option>
                    <option value="coordinator">👑 Coordenador</option>
                  </select>
                </div>

                {/* Personal Information Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.5rem'
                }}>
                  {/* Name */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.text.primary,
                      marginBottom: '0.5rem'
                    }}>
                      Nome Completo <span style={{ color: theme.colors.danger[500] }}>*</span>
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
                        placeholder="Nome completo do membro"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 3rem',
                          border: `1px solid ${errors.name ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s ease-in-out'
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

                  {/* Email */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.text.primary,
                      marginBottom: '0.5rem'
                    }}>
                      Email <span style={{ color: theme.colors.danger[500] }}>*</span>
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
                        placeholder="email@exemplo.com"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 3rem',
                          border: `1px solid ${errors.email ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s ease-in-out'
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

                  {/* Phone */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.text.primary,
                      marginBottom: '0.5rem'
                    }}>
                      Telefone <span style={{ color: theme.colors.danger[500] }}>*</span>
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
                          transition: 'border-color 0.2s ease-in-out'
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

                  {/* CPF */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.text.primary,
                      marginBottom: '0.5rem'
                    }}>
                      CPF <span style={{ color: theme.colors.danger[500] }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: theme.colors.text.secondary
                      }}>
                        <CreditCard size={18} />
                      </div>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder="123.456.789-00"
                        maxLength={14}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 3rem',
                          border: `1px solid ${errors.cpf ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s ease-in-out'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = theme.colors.primary[500];
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.cpf ? theme.colors.danger[500] : theme.colors.border;
                        }}
                      />
                    </div>
                    {errors.cpf && (
                      <p style={{
                        fontSize: '0.75rem',
                        color: theme.colors.danger[500],
                        marginTop: '0.25rem'
                      }}>
                        {errors.cpf}
                      </p>
                    )}
                  </div>

                  {/* RG */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.text.primary,
                      marginBottom: '0.5rem'
                    }}>
                      RG <span style={{ color: theme.colors.danger[500] }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: theme.colors.text.secondary
                      }}>
                        <FileText size={18} />
                      </div>
                      <input
                        type="text"
                        name="rg"
                        value={formData.rg}
                        onChange={handleInputChange}
                        placeholder="12.345.678-9"
                        maxLength={12}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 3rem',
                          border: `1px solid ${errors.rg ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s ease-in-out'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = theme.colors.primary[500];
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.rg ? theme.colors.danger[500] : theme.colors.border;
                        }}
                      />
                    </div>
                    {errors.rg && (
                      <p style={{
                        fontSize: '0.75rem',
                        color: theme.colors.danger[500],
                        marginTop: '0.25rem'
                      }}>
                        {errors.rg}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Section */}
                <div style={{
                  padding: '1.5rem',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.gray[50]
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: theme.colors.text.primary,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <MapPin size={18} />
                    Endereço
                  </h4>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    {/* CEP */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.text.primary,
                        marginBottom: '0.5rem'
                      }}>
                        CEP <span style={{ color: theme.colors.danger[500] }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        placeholder="12345-678"
                        maxLength={9}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${errors['address.zipCode'] ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          backgroundColor: theme.colors.white
                        }}
                      />
                      {errors['address.zipCode'] && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: theme.colors.danger[500],
                          marginTop: '0.25rem'
                        }}>
                          {errors['address.zipCode']}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    {/* Street */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.text.primary,
                        marginBottom: '0.5rem'
                      }}>
                        Logradouro <span style={{ color: theme.colors.danger[500] }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        placeholder="Rua, Avenida, etc."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${errors['address.street'] ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          backgroundColor: theme.colors.white
                        }}
                      />
                      {errors['address.street'] && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: theme.colors.danger[500],
                          marginTop: '0.25rem'
                        }}>
                          {errors['address.street']}
                        </p>
                      )}
                    </div>

                    {/* Number */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.text.primary,
                        marginBottom: '0.5rem'
                      }}>
                        Número <span style={{ color: theme.colors.danger[500] }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="address.number"
                        value={formData.address.number}
                        onChange={handleInputChange}
                        placeholder="123"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${errors['address.number'] ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          backgroundColor: theme.colors.white
                        }}
                      />
                      {errors['address.number'] && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: theme.colors.danger[500],
                          marginTop: '0.25rem'
                        }}>
                          {errors['address.number']}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    {/* Complement */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.text.primary,
                        marginBottom: '0.5rem'
                      }}>
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="address.complement"
                        value={formData.address.complement}
                        onChange={handleInputChange}
                        placeholder="Apto, Casa, etc."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          backgroundColor: theme.colors.white
                        }}
                      />
                    </div>

                    {/* Neighborhood */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.text.primary,
                        marginBottom: '0.5rem'
                      }}>
                        Bairro <span style={{ color: theme.colors.danger[500] }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="address.neighborhood"
                        value={formData.address.neighborhood}
                        onChange={handleInputChange}
                        placeholder="Nome do bairro"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${errors['address.neighborhood'] ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          backgroundColor: theme.colors.white
                        }}
                      />
                      {errors['address.neighborhood'] && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: theme.colors.danger[500],
                          marginTop: '0.25rem'
                        }}>
                          {errors['address.neighborhood']}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '1rem'
                  }}>
                    {/* City */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.text.primary,
                        marginBottom: '0.5rem'
                      }}>
                        Cidade <span style={{ color: theme.colors.danger[500] }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        placeholder="Nome da cidade"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${errors['address.city'] ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          backgroundColor: theme.colors.white
                        }}
                      />
                      {errors['address.city'] && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: theme.colors.danger[500],
                          marginTop: '0.25rem'
                        }}>
                          {errors['address.city']}
                        </p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: theme.colors.text.primary,
                        marginBottom: '0.5rem'
                      }}>
                        Estado <span style={{ color: theme.colors.danger[500] }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        placeholder="SP"
                        maxLength={2}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${errors['address.state'] ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          backgroundColor: theme.colors.white,
                          textTransform: 'uppercase'
                        }}
                      />
                      {errors['address.state'] && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: theme.colors.danger[500],
                          marginTop: '0.25rem'
                        }}>
                          {errors['address.state']}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Password - Only for new members */}
                {!editingMember && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: theme.colors.text.primary,
                      marginBottom: '0.5rem'
                    }}>
                      Senha Inicial <span style={{ color: theme.colors.danger[500] }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Senha para primeiro acesso"
                        style={{
                          width: '100%',
                          padding: '0.75rem 3rem 0.75rem 1rem',
                          border: `1px solid ${errors.password ? theme.colors.danger[500] : theme.colors.border}`,
                          borderRadius: theme.borderRadius.md,
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s ease-in-out'
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
                )}

                {/* Ministries */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: theme.colors.text.primary,
                    marginBottom: '0.5rem'
                  }}>
                    Ministérios <span style={{ color: theme.colors.danger[500] }}>*</span>
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    padding: '1rem',
                    border: `1px solid ${errors.ministries ? theme.colors.danger[500] : theme.colors.border}`,
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: theme.colors.gray[50]
                  }}>
                    {ministries.map(ministry => (
                      <label
                        key={ministry.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: theme.borderRadius.md,
                          backgroundColor: formData.ministries.includes(ministry.id) 
                            ? `${ministry.color}15` 
                            : 'transparent',
                          border: formData.ministries.includes(ministry.id) 
                            ? `1px solid ${ministry.color}` 
                            : '1px solid transparent',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.ministries.includes(ministry.id)}
                          onChange={() => handleMinistryToggle(ministry.id)}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: ministry.color
                          }}
                        />
                        <span style={{
                          fontSize: '0.875rem',
                          color: theme.colors.text.primary,
                          fontWeight: formData.ministries.includes(ministry.id) ? '500' : '400'
                        }}>
                          {ministry.name}
                        </span>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: ministry.color,
                          marginLeft: 'auto'
                        }}></div>
                      </label>
                    ))}
                  </div>
                  {errors.ministries && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: theme.colors.danger[500],
                      marginTop: '0.25rem'
                    }}>
                      {errors.ministries}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1rem'
                }}>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: theme.borderRadius.md,
                      backgroundColor: theme.colors.white,
                      color: theme.colors.text.secondary,
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.white;
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      backgroundColor: isLoading ? theme.colors.gray[400] : theme.colors.primary[500],
                      color: theme.colors.white,
                      border: 'none',
                      borderRadius: theme.borderRadius.md,
                      fontSize: '0.875rem',
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
                        {editingMember ? 'Atualizando...' : 'Salvando...'}
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        {editingMember ? 'Atualizar' : 'Salvar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Members List */}
        <div style={{
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.sm,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.gray[50]
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: theme.colors.text.primary
            }}>
              Lista de Membros ({filteredMembers.length})
            </h3>
          </div>

          {filteredMembers.length === 0 ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center'
            }}>
              <AlertCircle size={48} color={theme.colors.text.secondary} style={{ margin: '0 auto 1rem' }} />
              <p style={{
                fontSize: '1.125rem',
                color: theme.colors.text.secondary,
                marginBottom: '0.5rem'
              }}>
                Nenhum membro encontrado
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: theme.colors.text.muted
              }}>
                {searchTerm || filterType !== 'all' || filterMinistry !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece cadastrando o primeiro membro'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: theme.colors.gray[50] }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.text.primary,
                      borderBottom: `1px solid ${theme.colors.border}`
                    }}>
                      Membro
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.text.primary,
                      borderBottom: `1px solid ${theme.colors.border}`
                    }}>
                      Contato
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.text.primary,
                      borderBottom: `1px solid ${theme.colors.border}`
                    }}>
                      Documentos
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.text.primary,
                      borderBottom: `1px solid ${theme.colors.border}`
                    }}>
                      Endereço
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.text.primary,
                      borderBottom: `1px solid ${theme.colors.border}`
                    }}>
                      Tipo
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.text.primary,
                      borderBottom: `1px solid ${theme.colors.border}`
                    }}>
                      Ministérios
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.text.primary,
                      borderBottom: `1px solid ${theme.colors.border}`
                    }}>
                      Status
                    </th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: theme.colors.text.primary,
                      borderBottom: `1px solid ${theme.colors.border}`
                    }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member, index) => (
                    <tr
                      key={member.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? theme.colors.white : theme.colors.gray[50],
                        transition: 'background-color 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.primary[50];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? theme.colors.white : theme.colors.gray[50];
                      }}
                    >
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.colors.border}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: theme.colors.primary[500],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: theme.colors.white,
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}>
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: theme.colors.text.primary,
                              marginBottom: '0.25rem'
                            }}>
                              {member.name}
                            </p>
                            <p style={{
                              fontSize: '0.75rem',
                              color: theme.colors.text.secondary
                            }}>
                              Desde {member.createdAt.toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.colors.border}`
                      }}>
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: theme.colors.text.primary,
                            marginBottom: '0.25rem'
                          }}>
                            {member.email}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: theme.colors.text.secondary
                          }}>
                            {member.phone}
                          </p>
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.colors.border}`
                      }}>
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: theme.colors.text.primary,
                            marginBottom: '0.25rem'
                          }}>
                            CPF: {member.cpf}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: theme.colors.text.secondary
                          }}>
                            RG: {member.rg}
                          </p>
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.colors.border}`
                      }}>
                        <div>
                          <p style={{
                            fontSize: '0.875rem',
                            color: theme.colors.text.primary,
                            marginBottom: '0.25rem'
                          }}>
                            {member.address.street}, {member.address.number}
                            {member.address.complement && `, ${member.address.complement}`}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: theme.colors.text.secondary
                          }}>
                            {member.address.neighborhood}, {member.address.city}/{member.address.state}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: theme.colors.text.secondary
                          }}>
                            CEP: {member.address.zipCode}
                          </p>
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.colors.border}`
                      }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: theme.borderRadius.full,
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: member.userType === 'coordinator' 
                            ? theme.colors.secondary[100] 
                            : theme.colors.primary[100],
                          color: member.userType === 'coordinator' 
                            ? theme.colors.secondary[700] 
                            : theme.colors.primary[700]
                        }}>
                          {member.userType === 'coordinator' ? '👑 Coordenador' : '🙏 Voluntário'}
                        </span>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.colors.border}`
                      }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {member.ministries.slice(0, 2).map(ministryId => (
                            <span
                              key={ministryId}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: theme.borderRadius.md,
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                backgroundColor: `${getMinistryColor(ministryId)}15`,
                                color: getMinistryColor(ministryId),
                                border: `1px solid ${getMinistryColor(ministryId)}30`
                              }}
                            >
                              {getMinistryName(ministryId)}
                            </span>
                          ))}
                          {member.ministries.length > 2 && (
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: theme.borderRadius.md,
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              backgroundColor: theme.colors.gray[100],
                              color: theme.colors.gray[600]
                            }}>
                              +{member.ministries.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.colors.border}`,
                        textAlign: 'center'
                      }}>
                        <button
                          onClick={() => toggleMemberStatus(member.id)}
                          style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: theme.borderRadius.full,
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: member.status === 'active' 
                              ? theme.colors.success[100] 
                              : theme.colors.gray[100],
                            color: member.status === 'active' 
                              ? theme.colors.success[500] 
                              : theme.colors.gray[700],
                            transition: 'all 0.2s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {member.status === 'active' ? '● Ativo' : '○ Inativo'}
                        </button>
                      </td>
                      <td style={{
                        padding: '1rem',
                        borderBottom: `1px solid ${theme.colors.border}`,
                        textAlign: 'center'
                      }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEdit(member)}
                            style={{
                              padding: '0.5rem',
                              border: 'none',
                              borderRadius: theme.borderRadius.md,
                              backgroundColor: theme.colors.primary[100],
                              color: theme.colors.primary[600],
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = theme.colors.primary[200];
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = theme.colors.primary[100];
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            title="Editar membro"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            style={{
                              padding: '0.5rem',
                              border: 'none',
                              borderRadius: theme.borderRadius.md,
                              backgroundColor: theme.colors.danger[100],
                              color: theme.colors.danger[600],
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = theme.colors.danger[200];
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = theme.colors.danger[100];
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            title="Excluir membro"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Loading Animation CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};