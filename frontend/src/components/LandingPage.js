import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LandingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 20px;
`;

const HeroSection = styled.div`
  max-width: 800px;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 30px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  max-width: 1000px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  line-height: 1.5;
`;

const CTAButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 18px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <LandingContainer>
      <HeroSection>
        <Title>Master Plan Studio</Title>
        <Subtitle>Корпоративная платформа для управления проектами</Subtitle>
        <Description>
          Объедините команду, управляйте проектами и накапливайте знания в единой экосистеме. 
          Создавайте, сотрудничайте и достигайте целей вместе.
        </Description>
      </HeroSection>

      <FeaturesGrid>
        <FeatureCard>
          <FeatureIcon>🏢</FeatureIcon>
          <FeatureTitle>Управление организациями</FeatureTitle>
          <FeatureDescription>
            Создавайте компании, приглашайте участников и управляйте ролями доступа
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>📋</FeatureIcon>
          <FeatureTitle>Управление проектами</FeatureTitle>
          <FeatureDescription>
            Организуйте проекты, отслеживайте прогресс и координируйте работу команд
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🤖</FeatureIcon>
          <FeatureTitle>AI Агенты</FeatureTitle>
          <FeatureDescription>
            Автоматизируйте сбор данных, анализ и создание отчетов с помощью ИИ
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>🧠</FeatureIcon>
          <FeatureTitle>База знаний</FeatureTitle>
          <FeatureDescription>
            Накапливайте и структурируйте знания организации с помощью RAG технологий
          </FeatureDescription>
        </FeatureCard>
      </FeaturesGrid>

      <CTAButton onClick={handleGetStarted}>
        Начать работу
      </CTAButton>
    </LandingContainer>
  );
};

export default LandingPage;


