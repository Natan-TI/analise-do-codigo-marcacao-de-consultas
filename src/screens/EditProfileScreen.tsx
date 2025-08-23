/**
 * screens/EditProfileScreen.tsx
 * Responsabilidade: Tela de edição do perfil do usuário (admin, médico ou paciente).
 * Fluxo: usuário carrega dados atuais → edita informações → salva → atualiza no Context e AsyncStorage.
 */

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipagem da prop de navegação
type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

// ===== Componente principal =====
const EditProfileScreen: React.FC = () => {
  const { user, updateUser } = useAuth(); // Obtém usuário logado e função para atualizar
  const navigation = useNavigation<EditProfileScreenProps['navigation']>();
  
  // Estados controlados dos inputs
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [specialty, setSpecialty] = useState(user?.specialty || '');
  const [loading, setLoading] = useState(false);

  // ===== Salvar alterações no perfil =====
  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // Validação: nome e email obrigatórios
      if (!name.trim() || !email.trim()) {
        Alert.alert('Erro', 'Nome e email são obrigatórios');
        return;
      }

      // Cria novo objeto de usuário com dados atualizados
      const updatedUser = {
        ...user!,
        name: name.trim(),
        email: email.trim(),
        // Só adiciona especialidade se usuário for médico
        ...(user?.role === 'doctor' && { specialty: specialty.trim() }),
      };

      // Atualiza no Context (estado global de autenticação)
      await updateUser(updatedUser);

      // Persiste no AsyncStorage
      await AsyncStorage.setItem('@MedicalApp:user', JSON.stringify(updatedUser));

      // Mensagem de sucesso e retorno
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== Renderização da tela =====
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Editar Perfil</Title>

        <ProfileCard>
          {/* Avatar do usuário (imagem de perfil) */}
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
          
          {/* Campo: Nome */}
          <Input
            label="Nome"
            value={name}
            onChangeText={setName}
            containerStyle={styles.input}
            placeholder="Digite seu nome"
          />

          {/* Campo: Email */}
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.input}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Campo: Especialidade (apenas para médicos) */}
          {user?.role === 'doctor' && (
            <Input
              label="Especialidade"
              value={specialty}
              onChangeText={setSpecialty}
              containerStyle={styles.input}
              placeholder="Digite sua especialidade"
            />
          )}

          {/* Exibe badge com papel do usuário */}
          <RoleBadge role={user?.role || ''}>
            <RoleText>
              {user?.role === 'admin' ? 'Administrador' 
                : user?.role === 'doctor' ? 'Médico' 
                : 'Paciente'}
            </RoleText>
          </RoleBadge>
        </ProfileCard>

        {/* Botão: Salvar */}
        <Button
          title="Salvar Alterações"
          onPress={handleSaveProfile}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.saveButton}
        />

        {/* Botão: Cancelar */}
        <Button
          title="Cancelar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.cancelButton}
        />
      </ScrollView>
    </Container>
  );
};

// ===== Estilos adicionais =====
const styles = {
  scrollContent: { padding: 20 },
  input: { marginBottom: 15 },
  button: { marginBottom: 15, width: '100%' },
  saveButton: { backgroundColor: theme.colors.success, paddingVertical: 12 },
  cancelButton: { backgroundColor: theme.colors.secondary, paddingVertical: 12 },
};

// ===== Styled-components =====
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

const ProfileCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
`;

const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: { role: string }) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'doctor':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 10px;
`;

const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

export default EditProfileScreen;
