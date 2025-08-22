/**
 * screens/HomeScreen.tsx
 * Responsabilidade: Listar consultas salvas, atualizar via pull-to-refresh e navegar para criar nova.
 * Fluxo: carrega do AsyncStorage ao focar → exibe lista → botões de ação.
 */

//IMPORTS

// Imports: Ícones (Expo)
import { FontAwesome } from '@expo/vector-icons';

// Imports: Storage local persistente
import AsyncStorage from '@react-native-async-storage/async-storage';

// Imports: Hook para executar quando a tela ganha foco
import { useFocusEffect } from '@react-navigation/native';

// Imports: Tipagem de navegação (Stack)
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Imports: React + estado local
import React, { useState } from 'react';

// Imports: Componentes nativos (lista, refresh, toque)
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';

// Imports: Botões/Ícones prontos de UI
import { Button, Icon } from 'react-native-elements';

// Imports: Estilização com tema
import styled from 'styled-components/native';

// Imports: Header reutilizável
import { HeaderContainer, HeaderTitle } from '../components/Header';

// Imports: Tema (cores/espac/typography)
import theme from '../styles/theme';

// Imports: Tipo de Consulta
import { Appointment } from '../types/appointments';

// Imports: Tipo de Médico
import { Doctor } from '../types/doctors';

// Imports: Tipo das rotas
import { RootStackParamList } from '../types/navigation';


// ====== TIPAGEM DAS PROPS DA TELA ======
type HomeScreenProps = {
  // Navegação tipada para 'Home'
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};


// ====== MOCK DE MÉDICOS ======
// Lista fixa para mapear doctorId → dados exibidos (imagem/nome/especialidade)
const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologista',
    image: 'https://mighty.tools/mockmind-api/content/human/91.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Dermatologista',
    image: 'https://mighty.tools/mockmind-api/content/human/97.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Oftalmologista',
    image: 'https://mighty.tools/mockmind-api/content/human/79.jpg',
  },
];


// ====== COMPONENTE PRINCIPAL ======
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Estado: lista de consultas exibidas
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Estado: indicador do pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // Carrega consultas salvas no AsyncStorage (persistência local)
  const loadAppointments = async () => {
    try {
      // Recupera JSON serializado
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        // Atualiza estado com a lista
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      // Log de erro para diagnóstico
      console.error('Erro ao carregar consultas:', error);
    }
  };

  // Recarrega a lista sempre que a tela voltar a ficar em foco
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  // Handler: pull-to-refresh (puxa para baixo e recarrega)
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  // Util: retorna dados do médico a partir do id salvo na consulta
  const getDoctorInfo = (doctorId: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === doctorId);
  };

  // Renderizador de item da FlatList (um card por consulta)
  const renderAppointment = ({ item }: { item: Appointment }) => {
    const doctor = getDoctorInfo(item.doctorId);

    // Render: estrutura visual do componente
    return (
      <AppointmentCard>
        <DoctorImage source={{ uri: doctor?.image || 'https://via.placeholder.com/100' }} />
        <InfoContainer>
          <DoctorName>{doctor?.name || 'Médico não encontrado'}</DoctorName>
          <DoctorSpecialty>{doctor?.specialty || 'Especialidade não encontrada'}</DoctorSpecialty>
          <DateTime>{new Date(item.date).toLocaleDateString()} - {item.time}</DateTime>
          <Description>{item.description}</Description>
          <Status status={item.status}>
            {item.status === 'pending' ? 'Pendente' : 'Confirmado'}
          </Status>
          <ActionButtons>
            <ActionButton>
              <Icon name="edit" type="material" size={20} color={theme.colors.primary} />
            </ActionButton>
            <ActionButton>
              <Icon name="delete" type="material" size={20} color={theme.colors.error} />
            </ActionButton>
          </ActionButtons>
        </InfoContainer>
      </AppointmentCard>
    );
  };

  // ====== RENDERIZAÇÃO DA TELA ======
  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>Minhas Consultas</HeaderTitle>
      </HeaderContainer>
      
      {/* Conteúdo principal */}
      <Content>
        <Button
          title="Agendar Nova Consulta"
          icon={
            <FontAwesome
              name="calendar-plus-o"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          }
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: theme.spacing.medium
          }}
          onPress={() => navigation.navigate('CreateAppointment')}
        />

        {/* Lista de consultas com pull-to-refresh */}
        <AppointmentList
          data={appointments}
          keyExtractor={(item: Appointment) => item.id}
          renderItem={renderAppointment}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyText>Nenhuma consulta agendada</EmptyText>
          }
        />
      </Content>
    </Container>
  );
};

// ====== ESTILOS (styled-components) ======

// Estilo: Container
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Estilo: Conteúdo
const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

// Estilo: Lista
const AppointmentList = styled(FlatList)`
  flex: 1;
`;

// Estilo: Card para marcar consultas
const AppointmentCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: ${theme.spacing.medium}px;
  margin-bottom: ${theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

// Estilo: Imagem do médico
const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

// Estilo: Informação do container
const InfoContainer = styled.View`
  flex: 1;
`;

// Estilo: Nome do médico
const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

// Estilo: Especialidade do médico
const DoctorSpecialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-bottom: 4px;
`;

// Estilo: Data
const DateTime = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.primary};
  margin-top: 4px;
`;

// Estilo: Descrição
const Description = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-top: 4px;
`;

// Estilo: Status
const Status = styled.Text<{ status: string }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { status: string }) => props.status === 'pending' ? theme.colors.error : theme.colors.success};
  margin-top: 4px;
  font-weight: bold;
`;

// Estilo: Botões
const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${theme.spacing.small}px;
`;

const ActionButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.small}px;
  margin-left: ${theme.spacing.small}px;
`;

// Estilo: Texto vazio
const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: ${theme.spacing.large}px;
`;

export default HomeScreen;