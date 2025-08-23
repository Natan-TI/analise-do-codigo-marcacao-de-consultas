/**
 * components/TimeSlotList.tsx
 * Responsabilidade: Renderizar lista de horários disponíveis em blocos de 30 minutos.
 * Fluxo: gera horários entre 09:00 e 18:00 → exibe em grade responsiva → 
 * ao clicar em um horário, dispara callback onSelectTime.
 * Por quê: padroniza a seleção de horários de forma visual e intuitiva.
 */

import React from 'react';
import styled from 'styled-components/native';
import { ViewStyle, TouchableOpacity } from 'react-native';
import theme from '../styles/theme';

// ===== Tipagem das props do componente =====
interface TimeSlotListProps {
  onSelectTime: (time: string) => void; // Callback chamado ao selecionar um horário
  selectedTime?: string;                // Horário atualmente selecionado
  style?: ViewStyle;                    // Estilo adicional opcional
}

// Tipagem usada para props estilizadas
interface StyledProps {
  isSelected: boolean;
}

// ===== Componente principal =====
const TimeSlotList: React.FC<TimeSlotListProps> = ({
  onSelectTime,
  selectedTime,
  style,
}) => {
  // ===== Função utilitária: gera horários em intervalos de 30 min (09h → 18h) =====
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // ===== Renderização da lista de horários =====
  return (
    <Container style={style}>
      <TimeGrid>
        {timeSlots.map((time) => (
          <TimeCard
            key={time}
            onPress={() => onSelectTime(time)}      // Ao clicar, chama callback
            isSelected={selectedTime === time}     // Marca se está selecionado
          >
            <TimeText isSelected={selectedTime === time}>{time}</TimeText>
          </TimeCard>
        ))}
      </TimeGrid>
    </Container>
  );
};

// ===== Styled-components =====
const Container = styled.View`
  margin-bottom: 15px;
`;

const TimeGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px;
`;

const TimeCard = styled(TouchableOpacity)<StyledProps>`
  width: 23%;
  padding: 8px;
  border-radius: 6px;

  /* Destaque para horário selecionado */
  background-color: ${(props: StyledProps) =>
    props.isSelected ? theme.colors.primary + '20' : theme.colors.background};
  border-width: 1px;
  border-color: ${(props: StyledProps) =>
    props.isSelected ? theme.colors.primary : theme.colors.border};

  align-items: center;
  justify-content: center;
`;

const TimeText = styled.Text<StyledProps>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props: StyledProps) =>
    props.isSelected ? theme.colors.primary : theme.colors.text};
`;

export default TimeSlotList;
