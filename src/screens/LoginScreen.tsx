/**
 * screens/LoginScreen.tsx
 * Responsabilidade: Tela de login do sistema.
 * Fluxo: usuário informa email/senha → chama signIn (AuthContext) →
 * em caso de sucesso navega para dashboards / home → em caso de erro exibe mensagem.
 */

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Input, Button, Text } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';
import { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Tipagem para props de navegação
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC = () => {
  const { signIn } = useAuth(); // Hook do contexto de autenticação
  const navigation = useNavigation<LoginScreenProps['navigation']>();

  // Estados controlados para email, senha e controle de loading/erro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função de login
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn({ email, password }); // chama serviço de autenticação
    } catch (err) {
      setError('Email ou senha inválidos'); // erro genérico
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Título da tela */}
      <Title>App Marcação de Consultas</Title>
      
      {/* Campo de email */}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.input}
      />

      {/* Campo de senha */}
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={styles.input}
      />

      {/* Exibe mensagem de erro */}
      {error ? <ErrorText>{error}</ErrorText> : null}

      {/* Botão de login */}
      <Button
        title="Entrar"
        onPress={handleLogin}
        loading={loading}
        containerStyle={styles.button as ViewStyle}
        buttonStyle={styles.buttonStyle}
      />

      {/* Botão para ir para tela de cadastro */}
      <Button
        title="Cadastrar Novo Paciente"
        onPress={() => navigation.navigate('Register')}
        containerStyle={styles.registerButton as ViewStyle}
        buttonStyle={styles.registerButtonStyle}
      />

      {/* Dicas de credenciais para testes */}
      <Text style={styles.hint}>
        Use as credenciais de exemplo:
      </Text>
      <Text style={styles.credentials}>
        Admin: admin@example.com / 123456{'\n'}
        Médicos: joao@example.com, maria@example.com, pedro@example.com / 123456
      </Text>
    </Container>
  );
};

// ===== Estilos em objeto =====
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
  registerButton: {
    marginTop: 10,
    width: '100%',
  },
  registerButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  hint: {
    marginTop: 20,
    textAlign: 'center' as const,
    color: theme.colors.text,
  },
  credentials: {
    marginTop: 10,
    textAlign: 'center' as const,
    color: theme.colors.text,
    fontSize: 12,
  },
};

// ===== Styled-components =====
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

export default LoginScreen;
