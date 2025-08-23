/**
 * screens/CreateAppointmentScreen.tsx
 * Responsabilidade: Tela de criação de consultas, onde o paciente seleciona data, horário e médico.
 * Fluxo: paciente preenche → valida dados → salva no AsyncStorage → envia notificação ao médico →
 * volta para a tela anterior. 
 * Por quê: permite que o paciente agende consultas de forma simples e integrada ao sistema.
 */

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, ViewStyle } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import theme from '../styles/theme';
import Header from '../components/Header';
import DoctorList from '../components/DoctorList';
import TimeSlotList from '../components/TimeSlotList';
import { notificationService } from '../services/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== Tipagem para props de navegação =====
type CreateAppointmentScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

// ===== Tipagens locais =====
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  specialty: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
}

// ===== Lista mockada de médicos =====
// Obs: em versão real viria de uma API ou banco de dados
const availableDoctors: Doctor[] = [
  { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: '2', name: 'Dra. Maria Santos', specialty: 'Pediatria', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { id: '3', name: 'Dr. Pedro Oliveira', specialty: 'Ortopedia', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: '4', name: 'Dra. Ana Costa', specialty: 'Dermatologia', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: '5', name: 'Dr. Carlos Mendes', specialty: 'Oftalmologia', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

// ===== Componente principal =====
const CreateAppointmentScreen: React.FC = () => {
  const { user } = useAuth(); // Usuário logado (paciente)
  const navigation = useNavigation<CreateAppointmentScreenProps['navigation']>();

  // Estados locais para controle do formulário
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ===== Criação da consulta =====
  const handleCreateAppointment = async () => {
    try {
      setLoading(true);
      setError('');

      // Valida campos obrigatórios
      if (!date || !selectedTime || !selectedDoctor) {
        setError('Por favor, preencha a data e selecione um médico e horário');
        return;
      }

      // Recupera consultas já salvas no AsyncStorage
      const storedAppointments = await AsyncStorage.getItem('@MedicalApp:appointments');
      const appointments: Appointment[] = storedAppointments ? JSON.parse(storedAppointments) : [];

      // Monta objeto da nova consulta
      const newAppointment: Appointment = {
        id: Date.now().toString(),         // gera ID único baseado no timestamp
        patientId: user?.id || '',         // ID do paciente atual
        patientName: user?.name || '',     // Nome do paciente
        doctorId: selectedDoctor.id,       // ID do médico escolhido
        doctorName: selectedDoctor.name,   // Nome do médico
        date,                              // Data escolhida
        time: selectedTime,                // Horário escolhido
        specialty: selectedDoctor.specialty,
        status: 'pending',                 // Status inicial
      };

      // Adiciona nova consulta à lista
      appointments.push(newAppointment);

      // Salva lista atualizada no AsyncStorage
      await AsyncStorage.setItem('@MedicalApp:appointments', JSON.stringify(appointments));

      // Notifica o médico responsável
      await notificationService.notifyNewAppointment(selectedDoctor.id, newAppointment);

      alert('Consulta agendada com sucesso!');
      navigation.goBack(); // volta para a tela anterior
    } catch (err) {
      setError('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ===== Renderização da tela =====
  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Agendar Consulta</Title>

        {/* Campo de data */}
        <Input
          placeholder="Data (DD/MM/AAAA)"
          value={date}
          onChangeText={setDate}
          containerStyle={styles.input}
          keyboardType="numeric"
        />

        {/* Seleção de horário */}
        <SectionTitle>Selecione um Horário</SectionTitle>
        <TimeSlotList
          onSelectTime={setSelectedTime}
          selectedTime={selectedTime}
        />

        {/* Seleção de médico */}
        <SectionTitle>Selecione um Médico</SectionTitle>
        <DoctorList
          doctors={availableDoctors}
          onSelectDoctor={setSelectedDoctor}
          selectedDoctorId={selectedDoctor?.id}
        />

        {/* Exibe erros de validação */}
        {error ? <ErrorText>{error}</ErrorText> : null}

        {/* Botões de ação */}
        <Button
          title="Agendar"
          onPress={handleCreateAppointment}
          loading={loading}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

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

// ===== Estilos extras =====
const styles = {
  scrollContent: {
    padding: 20,
  },
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
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
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

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 10px;
  margin-top: 10px;
`;

const ErrorText = styled.Text`
  color: ${theme.colors.error};
  text-align: center;
  margin-bottom: 10px;
`;

export default CreateAppointmentScreen;
