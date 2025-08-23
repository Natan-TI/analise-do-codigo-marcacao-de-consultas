/**
 * components/StatisticsCard.tsx
 * Responsabilidade: Exibir um card de estatísticas com título, valor principal, ícone opcional e legenda.
 * Fluxo: recebe dados (title, value, subtitle, icon) → renderiza dentro de um card estilizado → 
 * cor pode ser customizada via props, usada no valor e na borda lateral.
 * Por quê: padroniza a visualização de métricas e indicadores no app.
 */

import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';
import theme from '../styles/theme';

// ===== Tipagem das props do componente =====
interface StatisticsCardProps {
  title: string;               // Título do card (ex: "Consultas")
  value: string | number;      // Valor principal exibido
  subtitle?: string;           // Texto auxiliar (opcional)
  color?: string;              // Cor personalizada (default: primary)
  icon?: React.ReactNode;      // Ícone opcional exibido ao lado do título
  style?: ViewStyle;           // Estilo adicional para o container
}

// ===== Componente principal =====
const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  color = theme.colors.primary,
  icon,
  style,
}) => {
  return (
    <Container style={style} color={color}>
      {/* Cabeçalho: ícone (se existir) + título */}
      <Header>
        {icon && <IconContainer>{icon}</IconContainer>}
        <Title>{title}</Title>
      </Header>

      {/* Valor principal destacado */}
      <Value color={color}>{value}</Value>

      {/* Subtítulo/legenda opcional */}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
};

// ===== Styled-components =====
const Container = styled.View<{ color: string }>`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  padding: 16px;
  margin: 8px;
  min-height: 120px;
  justify-content: space-between;

  /* Destaque colorido na lateral esquerda */
  border-left-width: 4px;
  border-left-color: ${(props) => props.color};

  /* Sombra para dar profundidade */
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const IconContainer = styled.View`
  margin-right: 8px;
`;

const Title = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
  opacity: 0.8;
`;

const Value = styled.Text<{ color: string }>`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.color};
  margin-bottom: 4px;
`;

const Subtitle = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.6;
`;

export default StatisticsCard;
