import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const AuthTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const AuthSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-radius: 12px;
  background: #f8f9fa;
  padding: 4px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  background: ${props => props.$active ? 'white' : 'transparent'};
  color: ${props => props.$active ? '#007bff' : '#666'};
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin-bottom: 20px;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #c3e6cb;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
  
  &:hover {
    border-color: #007bff;
    color: #007bff;
  }
`;

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    companyDescription: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      setSuccess('Успешный вход!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    const result = await register({
      email: registerData.email,
      password: registerData.password,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      companyName: registerData.companyName,
      companyDescription: registerData.companyDescription
    });
    
    if (result.success) {
      setSuccess('Регистрация успешна! Создана компания и аккаунт.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader>
          <AuthTitle>Master Plan Studio</AuthTitle>
          <AuthSubtitle>Войдите в систему или создайте аккаунт</AuthSubtitle>
        </AuthHeader>

        <TabContainer>
          <Tab 
            $active={activeTab === 'login'} 
            onClick={() => setActiveTab('login')}
          >
            Вход
          </Tab>
          <Tab 
            $active={activeTab === 'register'} 
            onClick={() => setActiveTab('register')}
          >
            Регистрация
          </Tab>
        </TabContainer>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {activeTab === 'login' ? (
          <Form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                className="form-input"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
            </div>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </SubmitButton>
          </Form>
        ) : (
          <Form onSubmit={handleRegister}>
            <FormRow>
              <div className="form-group">
                <label className="form-label">Имя</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Фамилия</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                  required
                />
              </div>
            </FormRow>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Название компании</label>
              <input
                type="text"
                className="form-input"
                value={registerData.companyName}
                onChange={(e) => setRegisterData({...registerData, companyName: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Описание компании (необязательно)</label>
              <textarea
                className="form-textarea"
                value={registerData.companyDescription}
                onChange={(e) => setRegisterData({...registerData, companyDescription: e.target.value})}
                placeholder="Краткое описание вашей компании..."
              />
            </div>

            <FormRow>
              <div className="form-group">
                <label className="form-label">Пароль</label>
                <input
                  type="password"
                  className="form-input"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Подтвердите пароль</label>
                <input
                  type="password"
                  className="form-input"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </FormRow>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Создание...' : 'Создать аккаунт и компанию'}
            </SubmitButton>
          </Form>
        )}

        <BackButton onClick={handleBackToLanding}>
          ← Вернуться на главную
        </BackButton>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;


