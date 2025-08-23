/**
 * components/NotificationBell.tsx
 * Responsabilidade: Exibir um ícone de sino com contador de notificações não lidas.
 * Fluxo: ao montar → carrega quantidade de notificações do usuário → atualiza a cada 30s → 
 * também atualiza quando a tela volta ao foco → ao clicar, navega para a tela de notificações.
 * Por quê: fornece feedback visual de notificações pendentes e atalho para acessá-las.
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { notificationService } from '../services/notifications';
import theme from '../styles/theme';

// ===== Componente principal =====
const NotificationBell: React.FC = () => {
  // Recupera usuário logado do contexto de autenticação
  const { user } = useAuth();
  // Hook de navegação para redirecionar ao clicar
  const navigation = useNavigation();
  // Estado que armazena a contagem de notificações não lidas
  const [unreadCount, setUnreadCount] = useState(0);

  // ===== Função para carregar quantidade de notificações não lidas =====
  const loadUnreadCount = async () => {
    if (!user?.id) return;
    
    try {
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erro ao carregar contador de notificações:', error);
    }
  };

  // ===== Efeito: carrega ao montar e agenda atualização a cada 30 segundos =====
  useEffect(() => {
    loadUnreadCount();
    
    const interval = setInterval(loadUnreadCount, 30000); // recarrega a cada 30s
    
    return () => clearInterval(interval); // limpa ao desmontar
  }, [user?.id]);

  // ===== Efeito: atualiza sempre que a tela volta ao foco =====
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUnreadCount);
    return unsubscribe;
  }, [navigation, user?.id]);

  // ===== Handler: ao clicar, navega para tela de notificações =====
  const handlePress = () => {
    navigation.navigate('Notifications' as never);
  };

  // ===== Renderização =====
  return (
    <TouchableOpacity onPress={handlePress}>
      <BellContainer>
        <BellIcon>🔔</BellIcon>
        {unreadCount > 0 && (
          <Badge
            value={unreadCount > 99 ? '99+' : unreadCount.toString()} // Mostra "99+" se ultrapassar
            status="error"
            containerStyle={styles.badge}
            textStyle={styles.badgeText}
          />
        )}
      </BellContainer>
    </TouchableOpacity>
  );
};

// ===== Estilos adicionais =====
const styles = {
  badge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
  },
  badgeText: {
    fontSize: 10,
  },
};

// ===== Styled-components =====
const BellContainer = styled.View`
  position: relative;
  padding: 8px;
`;

const BellIcon = styled.Text`
  font-size: 24px;
  color: ${theme.colors.white};
`;

export default NotificationBell;
