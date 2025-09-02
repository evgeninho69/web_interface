import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
  margin-bottom: 30px;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #007bff;
  font-size: 1.8rem;
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #333;
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #c82333;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 16px;
  margin-bottom: 30px;
  text-align: center;
`;

const WelcomeTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CompanyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CompanyItem = styled.div`
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #007bff;
    transform: translateY(-2px);
  }
`;

const CompanyName = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const CompanyDescription = styled.p`
  color: #666;
  margin-bottom: 10px;
`;

const CompanyRole = styled.span`
  background: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProjectItem = styled.div`
  padding: 20px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #28a745;
    transform: translateY(-2px);
  }
`;

const ProjectName = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const ProjectDescription = styled.p`
  color: #666;
  margin-bottom: 10px;
`;

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #888;
`;

const CreateProjectButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 20px;
  width: 100%;
  
  &:hover {
    background: #218838;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Загружаем компании пользователя
      const companiesResponse = await axios.get('/api/companies', {
        headers: {
          'X-User-ID': user.user_id
        }
      });
      
      if (companiesResponse.data.success) {
        setCompanies(companiesResponse.data.data);
        if (companiesResponse.data.data.length > 0) {
          setSelectedCompany(companiesResponse.data.data[0]);
          loadProjects(companiesResponse.data.data[0].company_id);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const loadProjects = async (companyId) => {
    try {
      const projectsResponse = await axios.get(`/api/projects?company_id=${companyId}`);
      if (projectsResponse.data.success) {
        setProjects(projectsResponse.data.data);
      }
    } catch (error) {
      console.error('Ошибка при загрузке проектов:', error);
    }
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    loadProjects(company.company_id);
  };

  const handleCreateProject = async () => {
    const projectName = prompt('Введите название проекта:');
    if (!projectName || !selectedCompany) return;

    const projectDescription = prompt('Введите описание проекта (необязательно):') || '';

    try {
      const response = await axios.post('/api/projects', {
        name: projectName,
        description: projectDescription,
        company_id: selectedCompany.company_id
      }, {
        headers: {
          'X-User-ID': user.user_id
        }
      });

      if (response.data.success) {
        loadProjects(selectedCompany.company_id);
      }
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
      alert('Ошибка при создании проекта');
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'owner': 'Владелец',
      'admin': 'Администратор',
      'member': 'Участник',
      'guest': 'Гость'
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Logo>Master Plan Studio</Logo>
          <UserInfo>
            <UserName>
              {user.first_name} {user.last_name}
            </UserName>
            <LogoutButton onClick={logout}>
              Выйти
            </LogoutButton>
          </UserInfo>
        </HeaderContent>
      </Header>

      <MainContent>
        <WelcomeSection>
          <WelcomeTitle>
            Добро пожаловать, {user.first_name}!
          </WelcomeTitle>
          <WelcomeSubtitle>
            Управляйте своими компаниями и проектами
          </WelcomeSubtitle>
        </WelcomeSection>

        <ContentGrid>
          <Section>
            <SectionTitle>
              🏢 Ваши компании
            </SectionTitle>
            
            {companies.length > 0 ? (
              <CompanyList>
                {companies.map((company) => (
                  <CompanyItem 
                    key={company.company_id}
                    onClick={() => handleCompanySelect(company)}
                    style={{
                      borderColor: selectedCompany?.company_id === company.company_id ? '#007bff' : '#e9ecef'
                    }}
                  >
                    <CompanyName>{company.company_name}</CompanyName>
                    {company.company_description && (
                      <CompanyDescription>{company.company_description}</CompanyDescription>
                    )}
                    <CompanyRole>{getRoleDisplayName(company.user_role)}</CompanyRole>
                  </CompanyItem>
                ))}
              </CompanyList>
            ) : (
              <EmptyState>
                <p>У вас пока нет компаний</p>
              </EmptyState>
            )}
          </Section>

          <Section>
            <SectionTitle>
              📋 Проекты {selectedCompany ? selectedCompany.company_name : ''}
            </SectionTitle>
            
            {selectedCompany ? (
              <>
                {projects.length > 0 ? (
                  <ProjectList>
                    {projects.map((project) => (
                      <ProjectItem key={project.id}>
                        <ProjectName>{project.name}</ProjectName>
                        {project.description && (
                          <ProjectDescription>{project.description}</ProjectDescription>
                        )}
                        <ProjectMeta>
                          <span>Создан: {new Date(project.created_at).toLocaleDateString('ru-RU')}</span>
                          <span>Создатель: {project.users?.first_name} {project.users?.last_name}</span>
                        </ProjectMeta>
                      </ProjectItem>
                    ))}
                  </ProjectList>
                ) : (
                  <EmptyState>
                    <p>В этой компании пока нет проектов</p>
                  </EmptyState>
                )}
                
                <CreateProjectButton onClick={handleCreateProject}>
                  + Создать новый проект
                </CreateProjectButton>
              </>
            ) : (
              <EmptyState>
                <p>Выберите компанию для просмотра проектов</p>
              </EmptyState>
            )}
          </Section>
        </ContentGrid>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;


