// UserManagementScreen.tsx
// Tela administrativa para gestão de usuários.
// Carrega a lista de usuários do AsyncStorage, oculta o usuário logado,
// permite excluir usuários e exibe informações (nome, e-mail e papel).
// A navegação é usada para voltar e para futuras ações como “Adicionar/Editar” (stubs).

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, TextStyle } from 'react-native';
import { Button, ListItem, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipagem da navegação para esta tela
type UserManagementScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserManagement'>;
};

// Estrutura de um usuário salvo
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
}

// Tipagem para props estilizadas
interface StyledProps {
  role: string;
}

const UserManagementScreen: React.FC = () => {
  // Usuário autenticado (usado para ocultar a si mesmo na listagem)
  const { user } = useAuth();
  // Hook de navegação tipado
  const navigation = useNavigation<UserManagementScreenProps['navigation']>();

  // Estado local com a lista de usuários (exceto o atual)
  const [users, setUsers] = useState<User[]>([]);
  // Indicador de carregamento inicial
  const [loading, setLoading] = useState(true);

  // Lê os usuários do AsyncStorage e atualiza o estado
  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        // Filtra o usuário atual da lista
        const filteredUsers = allUsers.filter(u => u.id !== user?.id);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Exclui um usuário pelo id e persiste a mudança
  const handleDeleteUser = async (userId: string) => {
    try {
      const storedUsers = await AsyncStorage.getItem('@MedicalApp:users');
      if (storedUsers) {
        const allUsers: User[] = JSON.parse(storedUsers);
        const updatedUsers = allUsers.filter(u => u.id !== userId);
        await AsyncStorage.setItem('@MedicalApp:users', JSON.stringify(updatedUsers));
        loadUsers(); // Recarrega a lista
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  // Carrega os usuários sempre que a tela volta ao foco
  useFocusEffect(
    React.useCallback(() => {
      loadUsers();
    }, [])
  );

  // Converte a role técnica para rótulo legível
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
    case 'doctor':
        return 'Médico';
      case 'patient':
        return 'Paciente';
      default:
        return role;
    }
  };

  return (
    <Container>
      {/* Cabeçalho reutilizável com informações do usuário e sino de notificações */}
      <Header />

      {/* Conteúdo rolável da tela */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Gerenciar Usuários</Title>

        {/* Ação de adicionar usuário (placeholder para implementação futura) */}
        <Button
          title="Adicionar Novo Usuário"
          onPress={() => {}}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        {/* Estados de carregamento / vazio / listagem */}
        {loading ? (
          <LoadingText>Carregando usuários...</LoadingText>
        ) : users.length === 0 ? (
          <EmptyText>Nenhum usuário cadastrado</EmptyText>
        ) : (
          users.map((user) => (
            <UserCard key={user.id}>
              <ListItem.Content>
                {/* Nome e e-mail do usuário */}
                <ListItem.Title style={styles.userName as TextStyle}>
                  {user.name}
                </ListItem.Title>
                <ListItem.Subtitle style={styles.userEmail as TextStyle}>
                  {user.email}
                </ListItem.Subtitle>

                {/* Badge com a role (cores variam por papel) */}
                <RoleBadge role={user.role}>
                  <RoleText role={user.role}>
                    {getRoleText(user.role)}
                  </RoleText>
                </RoleBadge>

                {/* Ações por item: editar (stub) e excluir (chama handleDeleteUser) */}
                <ButtonContainer>
                  <Button
                    title="Editar"
                    onPress={() => {}}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.editButton}
                  />
                  <Button
                    title="Excluir"
                    onPress={() => handleDeleteUser(user.id)}
                    containerStyle={styles.actionButton as ViewStyle}
                    buttonStyle={styles.deleteButton}
                  />
                </ButtonContainer>
              </ListItem.Content>
            </UserCard>
          ))
        )}

        {/* Volta para a tela anterior */}
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.backButton}
        />
      </ScrollView>
    </Container>
  );
};

// Estilos em objeto para componentes de terceiros (react-native-elements)
const styles = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  backButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  actionButton: {
    marginTop: 8,
    width: '48%',
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
};

// Estilos com styled-components (aplicados a Views/Text nativos)
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const UserCard = styled(ListItem)`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const LoadingText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
`;

const RoleBadge = styled.View<StyledProps>`
  background-color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'doctor':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 8px;
`;

const RoleText = styled.Text<StyledProps>`
  color: ${(props: StyledProps) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary;
      case 'doctor':
        return theme.colors.success;
      default:
        return theme.colors.secondary;
    }
  }};
  font-size: 12px;
  font-weight: 500;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

export default UserManagementScreen;
