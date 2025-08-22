/**
 * components/AppointmentForm.tsx
 * Responsabilidade: Formulário para criar/agendar consultas (médico, data, horário, descrição).
 * Fluxo: seleciona médico → formata/valida data → escolhe horário → descreve → onSubmit envia payload.
 * Por quê: concentra a lógica de criação de consulta e entrega dados consistentes para a tela.
 */

//IMPORTS

// Imports: React + estado local do formulário
import React, { useState } from 'react';

// Imports: elemento clicável nativo
import { TouchableOpacity } from 'react-native';

// Imports: componentes prontos (Input/Texto/Botão)
import { Button, Input, Text } from 'react-native-elements';

// Imports: estilização com tema
import styled from 'styled-components/native';

// Imports: tema padronizado (cores, tipografia, espaçamentos)
import theme from '../styles/theme';

// Tipos: domínio de médicos
import { Doctor } from '../types/doctors';

// Mock: lista fixa de médicos para seleção no formulário (pode vir do backend no futuro)
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

// Tipos: contrato de saída do formulário (onSubmit recebe este objeto)
type AppointmentFormProps = {
   onSubmit: (appointment: {
      doctorId: string;
      date: Date;
      time: string;
      description: string;
   }) => void;
};

// Util: gera intervalo de horários entre 09:00 e 17:30 em passos de 30min
const generateTimeSlots = () => {
   const slots = [];
   for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
   }
   return slots;
};

// Componente principal: função React
const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
   // Estado: identificação do médico selecionado
   const [selectedDoctor, setSelectedDoctor] = useState<string>('');
   // Estado: campo de data (com máscara em DD/MM/AAAA)
   const [dateInput, setDateInput] = useState('');
   // Estado: horário selecionado (string HH:mm)
   const [selectedTime, setSelectedTime] = useState<string>('');
   // Estado: descrição livre do motivo/observações da consulta
   const [description, setDescription] = useState('');
   // Constante: grade de horários disponíveis (gerado localmente)
   const timeSlots = generateTimeSlots();

// Validação: confere formato DD/MM/AAAA e janela entre hoje e +3 meses
   const validateDate = (inputDate: string) => {
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = inputDate.match(dateRegex);

      if (!match) return false;

      const [, day, month, year] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

      // Observação: comparações incluem hora atual; para uso real, considere normalizar horas para 00:00.
      return date >= today && date <= maxDate;
   };

   // Máscara de data: permite apenas números e formata conforme o usuário digita
   const handleDateChange = (text: string) => {
      // Remove todos os caracteres não numéricos
      const numbers = text.replace(/\D/g, '');
      
      // Formata a data enquanto digita
      let formattedDate = '';
      if (numbers.length > 0) {
         if (numbers.length <= 2) {
            formattedDate = numbers;
         } else if (numbers.length <= 4) {
            formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
         } else {
            formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
         }
      }

      setDateInput(formattedDate);
   };

   // Handler: valida campos obrigatórios, valida data e emite payload normalizado via onSubmit
   const handleSubmit = () => {
      if (!selectedDoctor || !selectedTime || !description) {
         alert('Por favor, preencha todos os campos');
         return;
      }

      if (!validateDate(dateInput)) {
         alert('Por favor, insira uma data válida (DD/MM/AAAA)');
         return;
      }

      // Normalização: transforma DD/MM/AAAA em Date (fuso do dispositivo)
      const [day, month, year] = dateInput.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      onSubmit({
         doctorId: selectedDoctor,
         date,
         time: selectedTime,
         description,
      });
   };

   // Stub: regra de disponibilidade de horários (a ser integrada ao backend)
   const isTimeSlotAvailable = (time: string) => {
      // Ex.: checar conflitos com consultas existentes para o médico selecionado nesta data
      return true;
   };

   // Render: UI do formulário (médico → data → horário → descrição → submit)
   return (
      <Container>
         <Title>Selecione o Médico</Title>
         <DoctorList>
            {doctors.map((doctor) => (
               <DoctorCard
                  key={doctor.id}
                  selected={selectedDoctor === doctor.id}
                  onPress={() => setSelectedDoctor(doctor.id)}
               >
                  <DoctorImage source={{ uri: doctor.image }} />
                  <DoctorInfo>
                     <DoctorName>{doctor.name}</DoctorName>
                     <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
                  </DoctorInfo>
               </DoctorCard>
            ))}
         </DoctorList>

         <Title>Data e Hora</Title>
         <Input
            placeholder="Data (DD/MM/AAAA)"
            value={dateInput}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
            containerStyle={InputContainer}
            errorMessage={dateInput && !validateDate(dateInput) ? 'Data inválida' : undefined}
         />

         <TimeSlotsContainer>
            <TimeSlotsTitle>Horários Disponíveis:</TimeSlotsTitle>
            <TimeSlotsGrid>
               {timeSlots.map((time) => {
                  const isAvailable = isTimeSlotAvailable(time);
                  // Render: estrutura visual do componente
                  return (
                     <TimeSlotButton
                        key={time}
                        selected={selectedTime === time}
                        disabled={!isAvailable}
                        onPress={() => isAvailable && setSelectedTime(time)}
                     >
                        <TimeSlotText selected={selectedTime === time} disabled={!isAvailable}>
                           {time}
                        </TimeSlotText>
                     </TimeSlotButton>
                  );
               })}
            </TimeSlotsGrid>
         </TimeSlotsContainer>

         <Input
            placeholder="Descrição da consulta"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            containerStyle={InputContainer}
         />

         <SubmitButton
            title="Agendar Consulta"
            onPress={handleSubmit}
            buttonStyle={{
               backgroundColor: theme.colors.primary,
               borderRadius: 8,
               padding: 12,
               marginTop: 20,
            }}
         />
      </Container>
   );
};

/* =========================
 * Estilização (styled-components)
 * ========================= */

// Estilo: Container da aplicação
const Container = styled.View`
  padding: ${theme.spacing.medium}px;
`;

// Estilo: Título
const Title = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.medium}px;
`;

// Estilo: Lista de médicos
const DoctorList = styled.ScrollView`
  margin-bottom: ${theme.spacing.large}px;
`;

// Estilo: Card de um médico
const DoctorCard = styled(TouchableOpacity)<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.medium}px;
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.white};
  border-radius: 8px;
  margin-bottom: ${theme.spacing.medium}px;
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

// Estilo: Informação do médico
const DoctorInfo = styled.View`
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
`;

// Estilo: Container dos horários disponíveis
const TimeSlotsContainer = styled.View`
  margin-bottom: ${theme.spacing.large}px;
`;

// Estilo: Título dos horários disponíveis
const TimeSlotsTitle = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small}px;
`;

// Estilo: Grid dos horários disponíveis
const TimeSlotsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.spacing.small}px;
`;

// Estilo: Botão dos horários disponíveis
const TimeSlotButton = styled(TouchableOpacity)<{ selected: boolean; disabled: boolean }>`
  background-color: ${(props: { selected: boolean; disabled: boolean }) => 
    props.disabled 
      ? theme.colors.background 
      : props.selected 
        ? theme.colors.primary 
        : theme.colors.white};
  padding: ${theme.spacing.small}px ${theme.spacing.medium}px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${(props: { selected: boolean; disabled: boolean }) => 
    props.disabled 
      ? theme.colors.background 
      : props.selected 
        ? theme.colors.primary 
        : theme.colors.text};
  opacity: ${(props: { disabled: boolean }) => props.disabled ? 0.5 : 1};
`;

// Estilo: Textos dos horários disponíveis
const TimeSlotText = styled(Text)<{ selected: boolean; disabled: boolean }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { selected: boolean; disabled: boolean }) => 
    props.disabled 
      ? theme.colors.text 
      : props.selected 
        ? theme.colors.white 
        : theme.colors.text};
`;

const InputContainer = {
   marginBottom: theme.spacing.medium,
   backgroundColor: theme.colors.white,
   borderRadius: 8,
   paddingHorizontal: theme.spacing.medium,
};

// Estilo: Botão para enviar o formulário
const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing.large}px;
`;

export default AppointmentForm;