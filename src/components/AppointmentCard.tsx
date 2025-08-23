/**
 * components/AppointmentCard.tsx
 * Responsabilidade: Exibir visualmente as informações de uma consulta agendada.
 * Fluxo: recebe props com nome do médico, data, hora, especialidade e status → 
 * renderiza um cartão estilizado usando react-native-elements + styled-components.
 * Por quê: organiza as consultas em um componente reutilizável e padronizado.
 */

import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle } from 'react-native';
import { Card, Text, Avatar } from 'react-native-elements';
import theme from '../styles/theme';

// Tipagem das props recebidas pelo card
interface AppointmentCardProps {
  doctorName: string;                    // Nome do médico
  date: string;                          // Data da consulta
  time: string;                          // Hora da consulta
  specialty: string;                     // Especialidade do médico
  status: 'pending' | 'confirmed' | 'cancelled'; // Status atual da consulta
  onPress?: () => void;                  // Callback opcional ao clicar
  style?: ViewStyle;                     // Estilo adicional para personalizar o card
}

// ===== Componente principal =====
const AppointmentCard: React.FC<AppointmentCardProps> = ({
  doctorName,
  date,
  time,
  specialty,
  status,
  onPress,
  style,
}) => {
  // Função utilitária: retorna cor de acordo com o status da consulta
  const getStatusColor = () => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  // Renderização do card
  return (
    <Card containerStyle={[styles.card, style]}>
      <CardContent>
        {/* Cabeçalho com médico e avatar */}
        <DoctorInfo>
          <Avatar
            size="medium"
            rounded
            source={{ uri: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 10)}.jpg` }}
            containerStyle={styles.avatar}
          />
          <TextContainer>
            <DoctorName>{doctorName}</DoctorName>
            <Specialty>{specialty}</Specialty>
          </TextContainer>
        </DoctorInfo>

        {/* Informações de data e hora */}
        <AppointmentInfo>
          <InfoRow>
            <InfoLabel>Data:</InfoLabel>
            <InfoValue>{date}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Horário:</InfoLabel>
            <InfoValue>{time}</InfoValue>
          </InfoRow>
        </AppointmentInfo>

        {/* Status da consulta (Confirmada, Cancelada ou Pendente) */}
        <StatusContainer>
          <StatusDot color={getStatusColor()} />
          <StatusText color={getStatusColor()}>
            {status === 'confirmed' 
              ? 'Confirmada' 
              : status === 'cancelled' 
                ? 'Cancelada' 
                : 'Pendente'}
          </StatusText>
        </StatusContainer>
      </CardContent>
    </Card>
  );
};

// ===== Estilos adicionais usados pelo Card =====
const styles = {
  card: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
};

// ===== Styled-components para layout interno =====
const CardContent = styled.View`
  padding: 10px;
`;

const DoctorInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const TextContainer = styled.View`
  margin-left: 15px;
`;

const DoctorName = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
`;

const Specialty = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

const AppointmentInfo = styled.View`
  margin-bottom: 15px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const StatusDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 8px;
`;

const StatusText = styled.Text<{ color: string }>`
  font-size: 14px;
  color: ${props => props.color};
  font-weight: 500;
`;

export default AppointmentCard;
