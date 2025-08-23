// RegisterScreen.tsx
// Tela de cadastro de novos pacientes. 
// Permite inserir nome, email e senha, valida os campos e chama o serviço de autenticação 
// para registrar o usuário. Após o cadastro, o usuário é redirecionado para a tela de login.

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Tipagem da navegação para esta tela
type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const RegisterScreen: React.FC = () => {
  // Função de registro vinda do contexto de autenticação
  const { register } = useAuth();
  // Hook de navegação
  const navigation = useNavigation<RegisterScreenProps['navigation']>();

  // Estados locais para capturar os valores do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função chamada ao clicar em "Cadastrar"
  const handleRegister = async () => {
    try {
      setLoading(true);
      setError('');

      // Validação simples de campos obrigatórios
      if (!name || !email || !password) {
        setError('Por favor, preencha todos os campos');
        return;
      }

      // Chama o serviço de autenticação para registrar o usuário
      await register({
        name,
        email,
        password,
      });

      // Após sucesso, redireciona para a tela de Login
      navigation.navigate('Login');
    } catch (err) {
      // Exibe erro caso ocorra falha no processo
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Cadastro de Paciente</Title>
      
      {/* Campo Nome */}
      <Input
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        containerStyle={styles.input}
      />

      {/* Campo Email */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.input}
      />

      {/* Campo Senha */}
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.input}
      />

      {/* Exibição de mensagem de erro */}
      {error ? <ErrorText>{error}</ErrorText> : null}

      {/* Botão de cadastro */}
      <Button
        title="Cadastrar"
        onPress={handleRegister}
        loading={loading}
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      {/* Botão para voltar ao Login */}
      <Button
        title="Voltar para Login"
        onPress={() => navigation.navigate('Login')}
        containerStyle={styles.backButton as ViewStyle}
        buttonStyle={styles.backButtonStyle}
      />
    </Container>
  );
};

// Estilos em objeto (utilizados nos Inputs e Botões)
const styles = {
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  backButton: {
    marginTop: 10,
    width: '100%',
  },
  backButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
};

// Estilização com styled-components
const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  background-color: ${theme.colors.background};
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: ${theme.colors.text};
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default RegisterScreen;
