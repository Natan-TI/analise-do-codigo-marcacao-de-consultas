/**
 * screens/CreateAppointmentScreen.tsx
 * Responsabilidade: Tela para criar nova consulta e persistir no AsyncStorage.
 * Fluxo: recebe dados do formulário → monta objeto → salva → navega para Home.
 */

//IMPORTS

// Imports: React para criar componente funcional
import React from 'react';

// Imports: Estilização com tema
import styled from 'styled-components/native';

// Imports: Cabeçalho padrão reutilizável
import { HeaderContainer, HeaderTitle } from '../components/Header';

// Imports: Formulário de agendamento
import AppointmentForm from '../components/AppointmentForm';

// Imports: Tema visual padronizado
import theme from '../styles/theme';

// Imports: Tipagem de navegação
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Imports: Armazenamento local persistente
import AsyncStorage from '@react-native-async-storage/async-storage';

// Imports: Tipagem de consultas
import { Appointment } from '../types/appointments';

// Imports: Tipagem das rotas
import { RootStackParamList } from '../types/navigation';

// ====== TIPAGEM DAS PROPS ======
// A tela recebe prop navigation para controlar a navegação via Stack
type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

// ====== COMPONENTE PRINCIPAL DA TELA ======
const CreateAppointmentScreen: React.FC<CreateAppointmentScreenProps> = ({ navigation }) => {
  // Handler: lida com a submissão do formulário
  const handleSubmit = async (appointment: {
    doctorId: string;
    date: Date;
    time: string;
    description: string;
  }) => {
    try {
      // Recuperar consultas já salvas no AsyncStorage
      const existingAppointments = await AsyncStorage.getItem('appointments');
      const appointments = existingAppointments ? JSON.parse(existingAppointments) : [];

       // Criar nova consulta (com id único baseado em timestamp e status inicial "pending")
      const newAppointment = {
        id: Date.now().toString(),
        ...appointment,
        status: 'pending',
      };

      // Adiciona a nova consulta à lista existente
      appointments.push(newAppointment);

      // Salvar lista atualizada no AsyncStorage
      await AsyncStorage.setItem('appointments', JSON.stringify(appointments));

      // Redirecionar o usuário para a tela inicial (Home)
      navigation.navigate('Home');
    } catch (error) {
      // Tratamento de erros (log + feedback visual ao usuário)
      console.error('Erro ao salvar consulta:', error);
      alert('Erro ao salvar a consulta. Tente novamente.');
    }
  };

// Render: estrutura visual do componente
  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>Agendar Consulta</HeaderTitle>
      </HeaderContainer>

      <Content>
        <AppointmentForm onSubmit={handleSubmit} />
      </Content>
    </Container>
  );
};

// ====== ESTILOS ======

// Estilo: Container
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

export default CreateAppointmentScreen;