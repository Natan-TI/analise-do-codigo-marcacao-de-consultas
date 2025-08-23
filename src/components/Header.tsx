/**
 * components/Header.tsx
 * Responsabilidade: Exibir cabeçalho do app com avatar do usuário logado, mensagem de boas-vindas e ícone de notificações.
 * Fluxo: busca usuário do contexto de autenticação → se não houver usuário, não renderiza nada → 
 * caso contrário, mostra avatar, nome e o componente NotificationBell.
 * Por quê: padroniza a barra superior com informações de contexto e ações rápidas.
 */

import React from 'react';
import styled from 'styled-components/native';
import { Avatar } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import theme from '../styles/theme';

// ===== Componente principal =====
const Header: React.FC = () => {
  // Hook de contexto: recupera dados do usuário autenticado
  const { user } = useAuth();

  // Caso não haja usuário logado, não renderiza nada
  if (!user) return null;

  // Renderização do cabeçalho
  return (
    <Container>
      {/* Bloco de informações do usuário */}
      <UserInfo>
        <Avatar
          size="medium"
          rounded
          source={{ uri: user.image }}
          containerStyle={styles.avatar}
        />
        <TextContainer>
          <WelcomeText>Bem-vindo(a),</WelcomeText>
          <UserName>{user.name}</UserName>
        </TextContainer>
      </UserInfo>

      {/* Ícone de notificações */}
      <NotificationBell />
    </Container>
  );
};

// ===== Estilos adicionais do Avatar =====
const styles = {
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

// ===== Styled-components =====
const Container = styled.View`
  background-color: ${theme.colors.primary};
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const TextContainer = styled.View`
  margin-left: 12px;
`;

const WelcomeText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.white};
  opacity: 0.9;
`;

const UserName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.white};
`;

export default Header;
